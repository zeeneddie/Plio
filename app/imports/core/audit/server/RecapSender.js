import moment from 'moment-timezone';

import { AuditLogs } from '/imports/api/audit-logs/audit-logs.js';
import { CollectionNames } from '/imports/api/constants.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { Standards } from '/imports/api/standards/standards.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';
import { Actions } from '/imports/api/actions/actions.js';
import { getCollectionByName } from '/imports/api/helpers.js';
import NotificationSender from '../../NotificationSender.js';


const RECAP_EMAIL_TEMPLATE = '';

export default class RecapSender {

  constructor(orgOrId) {
    let org = orgOrId;
    if (_(orgOrId).isString()) {
      org = Organizations.findOne({ _id: orgOrId });
    }

    this._organization = org;

    this._logsMap = {};
    this._docsMap = {};
    this._receiversMap = {};

    this._updateExecutorsMap = {};

    this._emailSubject = '';
  }

  send() {
    this._processLogs();
    this._sendEmails();
    this._reset();
  }

  _processLogs() {
    const allDocsIds = this._getAllDocsIds();
    const { startDate, endDate } = this._getLogDates();

    const logsQuery = {
      documentId: { $in: allDocsIds },
      collection: { $in: _(CollectionNames).values() },
      date: {
        $gt: startDate,
        $lt: endDate
      }
    };

    AuditLogs.find(logsQuery).forEach(log => this._processLog(log));
  }

  _processLog(log) {
    const { documentId, collection, message } = log;
    const docLogs = this._logsMap[documentId];

    const { timezone } = this._organization;
    const date = moment(log.date).tz(timezone).format('MMMM DD, YYYY');

    let executor = log.executor;
    if (!this._updateExecutorsMap[executor]) {
      const executorDoc = Meteor.users.findOne({ _id: executor });
      this._updateExecutorsMap[executor] = executorDoc.fullNameOrEmail();
    }
    executor = this._updateExecutorsMap[executor];

    if (_(docLogs).isArray()) {
      docLogs.push({ date, executor, message });
    } else {
      this._logsMap[documentId] = [{ date, executor, message }];
    }

    if (this._docsMap[documentId]) {
      return;
    }

    const docCollection = getCollectionByName(collection);
    const doc = docCollection.findOne({ _id: documentId });
    const docTitle = this._getDocTitle(doc, collection);

    this._docsMap[documentId] = { docTitle };

    const { notify } = doc;

    const key = {
      [CollectionNames.STANDARDS]: 'standards',
      [CollectionNames.NCS]: 'ncs',
      [CollectionNames.RISKS]: 'risks',
      [CollectionNames.ACTIONS]: 'actions'
    }[collection];

    _(notify).each((userId) => {
      if (!this._receiversMap[userId]) {
        this._receiversMap[userId] = {
          standards: [],
          ncs: [],
          risks: [],
          actions: []
        };
      }

      this._receiversMap[userId][key].push(documentId);
    });
  }

  _getAllDocsIds() {
    const { _id:organizationId } = this._organization;

    const getDocsIds = (collection) => {
      return collection.find({ organizationId }).map(({ _id }) => _id);
    };

    return [
      ...getDocsIds(Standards),
      ...getDocsIds(NonConformities),
      ...getDocsIds(Risks),
      ...getDocsIds(Actions)
    ];
  }

  _sendEmails() {
    this._emailSubject = this._getEmailSubject();

    _(this._receiversMap).each((docsIds, userId) => {
      this._sendEmailToUser(userId, docsIds);
    });
  }

  _sendEmailToUser(userId, docsIds) {
    const templateData = {
      organizationName: this._organization.name,
      title: this._emailSubject,
    };

    _(['standards', 'ncs', 'risks', 'actions']).each((key) => {
      templateData[key] = [];

      _(docsIds[key]).each((id) => {
        templateData[key].push({
          title: this._docsMap[id].docTitle,
          logs: this._logsMap[id]
        });
      });
    });

    new NotificationSender({
      recipients: userId,
      emailSubject: this._emailSubject,
      templateName: RECAP_EMAIL_TEMPLATE,
      templateData
    }).sendEmail();
  }

  _getLogDates() {
    const { timezone } = this._organization;
    const previousDay = moment().tz(timezone).subtract(1, 'day');
    const startDate = previousDay.startOf('day').toDate();
    const endDate = previousDay.endOf('day').toDate();

    return { startDate, endDate };
  }

  _getDocTitle(doc, collectionName) {
    if (collectionName === CollectionNames.STANDARDS) {
      return `"${doc.title}"`;
    } else {
      return `${doc.sequentialId} "${doc.title}"`;
    }
  }

  _getEmailSubject() {
    const { timezone } = this._organization;
    const date = moment().tz(timezone).subtract(1, 'day').format('MMMM DD, YYYY');

    return `Daily recap for ${date}`;
  }

  _reset() {
    this._logsMap = {};
    this._docsMap = {};
    this._receiversMap = {};
    this._updateExecutorsMap = {};
    this._emailSubject = '';
  }

}
