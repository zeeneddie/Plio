import moment from 'moment-timezone';
import pluralize from 'pluralize';

import { AuditLogs } from '/imports/api/audit-logs/audit-logs.js';
import { CollectionNames } from '/imports/api/constants.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { Standards } from '/imports/api/standards/standards.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';
import { Actions } from '/imports/api/actions/actions.js';
import { WorkItems } from '/imports/api/work-items/work-items.js';
import { getCollectionByName } from '/imports/api/helpers.js';
import NotificationSender from '../../NotificationSender.js';


const RECAP_EMAIL_TEMPLATE = 'recapEmail';

export default class RecapSender {

  constructor(orgId, date) {
    this._organizationId = orgId;
    this._date = date;
  }

  setDate(date) {
    this._date = date;
  }

  send() {
    this._prepare();
    this._processLogs();
    this._makeRecapData();
    this._sendEmails();
  }

  _prepare() {
    this._organization = Organizations.findOne({
      _id: this._organizationId
    });

    const { timezone } = this._organization;
    const date = this._date;
    let recapDate;

    if (!date) {
      recapDate = moment().tz(timezone).subtract(1, 'day').toDate();
    } else {
      recapDate = moment.tz([
        date.getFullYear(), date.getMonth(), date.getDate()
      ], timezone).toDate();
    }

    this._recapDate = recapDate;

    this._logsMap = {};

    this._standardsIds = new Set();
    this._ncsIds = new Set();
    this._risksIds = new Set();
    this._actionsIds = new Set();

    this._updateExecutorsMap = {};

    this._recapData = [];
  }

  _processLogs() {
    const allDocsIds = this._getAllDocsIds();
    const { startDate, endDate } = this._getLogDates();

    const docsCollections = [
      CollectionNames.STANDARDS,
      CollectionNames.NCS,
      CollectionNames.RISKS,
      CollectionNames.ACTIONS
    ];

    const query = {
      documentId: { $in: allDocsIds },
      collection: { $in: docsCollections },
      date: {
        $gt: startDate,
        $lt: endDate
      }
    };

    const options = { sort: { date: -1 } };

    AuditLogs.find(query, options).forEach(log => this._processLog(log));
  }

  _sendEmails() {
    if (_(this._logsMap).isEmpty()) {
      return;
    }

    const emailSubject = this._getEmailSubject();
    const recipients = this._getRecipients();

    const templateData = {
      organizationName: this._organization.name,
      title: emailSubject,
      recapData: this._recapData
    };

    new NotificationSender({
      templateName: RECAP_EMAIL_TEMPLATE,
      recipients,
      emailSubject,
      templateData
    }).sendEmail();
  }

  _getAllDocsIds() {
    const { _id:organizationId } = this._organization;

    const getDocsIds = (collection) => {
      return collection.find({
        organizationId
      }, {
        fields: { _id: 1 }
      }).map(({ _id }) => _id);
    };

    return [
      ...getDocsIds(Standards),
      ...getDocsIds(NonConformities),
      ...getDocsIds(Risks),
      ...getDocsIds(Actions)
    ];
  }

  _getLogDates() {
    const { timezone } = this._organization;
    const recapDate = moment(this._recapDate).tz(timezone);
    const startDate = recapDate.startOf('day').toDate();
    const endDate = recapDate.endOf('day').toDate();

    return { startDate, endDate };
  }

  _processLog(log) {
    const { documentId, collection, message } = log;
    const docLogs = this._logsMap[documentId];

    const { timezone } = this._organization;
    const date = moment(log.date).tz(timezone).format('DD MMM YYYY, h:mm A');

    let executor = log.executor;
    if (!this._updateExecutorsMap[executor]) {
      const executorDoc = Meteor.users.findOne({ _id: executor });
      const name = (executorDoc && executorDoc.fullNameOrEmail()) || executor;
      this._updateExecutorsMap[executor] = name;
    }
    executor = this._updateExecutorsMap[executor];

    if (_(docLogs).isArray()) {
      docLogs.push({ date, executor, message });
    } else {
      this._logsMap[documentId] = [{ date, executor, message }];
    }

    const set = {
      [CollectionNames.STANDARDS]: this._standardsIds,
      [CollectionNames.NCS]: this._ncsIds,
      [CollectionNames.RISKS]: this._risksIds,
      [CollectionNames.ACTIONS]: this._actionsIds
    }[collection];

    set.add(documentId);
  }

  _getEmailSubject() {
    const { timezone } = this._organization;
    const date = moment(this._recapDate).tz(timezone).format('MMMM DD, YYYY');

    return `Daily recap for ${date}`;
  }

  _getRecipients() {
    const orgMembers = _(this._organization.users).filter((userData) => {
      const { isRemoved, removedAt, removedBy } = userData;
      return !isRemoved && !removedAt && !removedBy;
    });

    return _(orgMembers).pluck('userId');
  }

  _makeRecapData() {
    const { serialNumber } = this._organization;

    this._makeCollectionData(
      Standards, this._standardsIds, 'standard',
      doc => doc.title,
      doc => Meteor.absoluteUrl(`${serialNumber}/standards/${doc._id}`)
    );

    this._makeCollectionData(
      NonConformities, this._ncsIds, 'non-conformity',
      doc => `${doc.sequentialId} "${doc.title}"`,
      doc => Meteor.absoluteUrl(`${serialNumber}/non-conformities/${doc._id}`)
    );

    this._makeCollectionData(
      Actions, this._actionsIds, 'action',
      doc => `${doc.sequentialId} "${doc.title}"`,
      (doc) => {
        const workItem = WorkItems.findOne({
          'linkedDoc._id': doc._id
        }, {
          sort: { createdAt: -1 }
        });
        if (workItem) {
          return Meteor.absoluteUrl(`${serialNumber}/work-inbox?id=${workItem._id}`);
        }
      }
    );

    this._makeCollectionData(
      Risks, this._risksIds, 'risk',
      doc => `${doc.sequentialId} "${doc.title}"`,
      doc => Meteor.absoluteUrl(`${serialNumber}/risks/${doc._id}`)
    );
  }

  _makeCollectionData(collection, idsSet, docName, descFn, urlFn) {
    const docsIds = Array.from(idsSet);

    const docsLength = docsIds.length;
    if (!docsLength) {
      return;
    }

    const title = `${docsLength} ${pluralize(docName, docsLength)} ` +
        `${pluralize('was', docsLength)} updated:`;

    let docsData = [];

    collection.find({ _id: { $in: docsIds } }).forEach((doc) => {
      const docDesc = descFn ? descFn(doc) : '';
      const docUrl = urlFn ? urlFn(doc) : '';

      docsData.push({
        desc: docDesc,
        url: docUrl,
        logs: this._logsMap[doc._id]
      });
    });

    docsData = _(docsData).sortBy('desc');

    this._recapData.push({ title, docs: docsData });
  }

}
