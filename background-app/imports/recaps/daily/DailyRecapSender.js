import moment from 'moment-timezone';
import pluralize from 'pluralize';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import { AuditLogs } from '/imports/share/collections/audit-logs';
import { CollectionNames } from '/imports/share/constants';
import { Organizations } from '/imports/share/collections/organizations';
import { Standards } from '/imports/share/collections/standards';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Risks } from '/imports/share/collections/risks';
import { Actions } from '/imports/share/collections/actions';
import { WorkItems } from '/imports/share/collections/work-items';
import { getPrettyTzDate } from '/imports/helpers/date';
import {
  getActionDesc,
  getActionName,
  getNCDesc,
  getProblemName,
  getRiskDesc,
  getStandardDesc,
  getStandardName,
} from '/imports/helpers/description';
import {
  getAbsoluteUrl,
  getNCUrl,
  getRiskUrl,
  getStandardUrl,
  getWorkItemUrl,
} from '/imports/helpers/url';
import NotificationSender from '/imports/share/utils/NotificationSender';


const RECAP_EMAIL_TEMPLATE = 'recapEmail';

export default class DailyRecapSender {
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
      _id: this._organizationId,
    });

    const { timezone } = this._organization;
    const date = this._date;
    let recapDate;

    if (!date) {
      recapDate = moment()
        .tz(timezone)
        .subtract(1, 'day')
        .toDate();
    } else {
      recapDate = moment.tz([
        date.getFullYear(), date.getMonth(), date.getDate(),
      ], timezone).toDate();
    }

    this._recapDate = recapDate;

    this._logsMap = {};

    this._standardsIds = new Set();
    this._ncsIds = new Set();
    this._risksIds = new Set();
    this._actionsIds = new Set();

    this._updateExecutorsMap = {};

    this._docsData = [];
    this._orgData = null;
    this._unsubscribeUrl = null;
  }

  _processLogs() {
    const { startDate, endDate } = this._getLogDates();

    const docsCollections = [
      CollectionNames.STANDARDS,
      CollectionNames.NCS,
      CollectionNames.RISKS,
      CollectionNames.ACTIONS,
      CollectionNames.ORGANIZATIONS,
    ];

    const query = {
      organizationId: this._organization._id,
      collection: { $in: docsCollections },
      date: {
        $gt: startDate,
        $lt: endDate,
      },
    };

    const options = { sort: { date: -1 } };

    AuditLogs.find(query, options).forEach(log => this._processLog(log));
  }

  _getLogDates() {
    const recapDate = moment(this._recapDate).tz(this._organization.timezone);
    const startDate = recapDate.startOf('day').toDate();
    const endDate = recapDate.endOf('day').toDate();

    return { startDate, endDate };
  }

  _processLog(log) {
    const { documentId, collection, message } = log;
    const docLogs = this._logsMap[documentId];

    const { timezone } = this._organization;
    const date = getPrettyTzDate(log.date, timezone, 'h:mm A');

    let executor = log.executor;
    if (!this._updateExecutorsMap[executor]) {
      const executorDoc = Meteor.users.findOne({ _id: executor });
      const name = (executorDoc && executorDoc.fullNameOrEmail()) || executor;
      this._updateExecutorsMap[executor] = name;
    }
    executor = this._updateExecutorsMap[executor];

    if (_.isArray(docLogs)) {
      docLogs.push({ date, executor, message });
    } else {
      this._logsMap[documentId] = [{ date, executor, message }];
    }

    const set = {
      [CollectionNames.STANDARDS]: this._standardsIds,
      [CollectionNames.NCS]: this._ncsIds,
      [CollectionNames.RISKS]: this._risksIds,
      [CollectionNames.ACTIONS]: this._actionsIds,
    }[collection];

    if (set) set.add(documentId);
  }

  _makeRecapData() {
    const { serialNumber } = this._organization;

    this._unsubscribeUrl = getAbsoluteUrl(`${serialNumber}/unsubscribe`);

    this._makeDocsData({
      collection: Standards,
      idsSet: this._standardsIds,
      docDescFn: getStandardDesc,
      docNameFn: getStandardName,
      docUrlFn: doc => getStandardUrl(serialNumber, doc._id),
    });

    this._makeDocsData({
      collection: NonConformities,
      idsSet: this._ncsIds,
      docDescFn: getNCDesc,
      docNameFn: getProblemName,
      docUrlFn: doc => getNCUrl(serialNumber, doc._id),
    });

    this._makeDocsData({
      collection: Actions,
      idsSet: this._actionsIds,
      docDescFn: getActionDesc,
      docNameFn: getActionName,
      docUrlFn: (doc) => {
        const workItem = WorkItems.findOne({
          'linkedDoc._id': doc._id,
        }, {
          fields: { _id: 1 },
          sort: { createdAt: -1 },
        });
        if (workItem) {
          return getWorkItemUrl(serialNumber, workItem._id);
        }
      },
    });

    this._makeDocsData({
      collection: Risks,
      idsSet: this._risksIds,
      docDescFn: getRiskDesc,
      docNameFn: getProblemName,
      docUrlFn: doc => getRiskUrl(serialNumber, doc._id),
    });

    this._makeOrgData();
  }

  _makeDocsData({
    collection, idsSet, docDescFn, docNameFn, docUrlFn,
  }) {
    const docsIds = Array.from(idsSet);

    const docsLength = docsIds.length;
    if (!docsLength) {
      return;
    }

    const docDesc = docDescFn ? docDescFn() : '';
    const title = `${docsLength} ${pluralize(docDesc, docsLength)} ` +
        `${pluralize('was', docsLength)} updated:`;

    let docsData = [];
    collection.find({ _id: { $in: docsIds } }).forEach((doc) => {
      const docName = docNameFn ? docNameFn(doc) : '';
      const docUrl = docUrlFn ? docUrlFn(doc) : '';

      docsData.push({
        desc: docName,
        url: docUrl,
        logs: this._logsMap[doc._id],
      });
    });

    docsData = _.sortBy(docsData, 'desc');

    this._docsData.push({ title, docs: docsData });
  }

  _makeOrgData() {
    const orgLogs = this._logsMap[this._organizationId];
    if (!orgLogs) {
      return;
    }

    this._orgData = { logs: orgLogs };
  }

  _sendEmails() {
    if (_.isEmpty(this._logsMap)) {
      return;
    }

    const emailSubject = this._getEmailSubject();
    const recipients = this._getRecipients();

    const templateData = {
      organizationName: this._organization.name,
      title: emailSubject,
      unsubscribeUrl: this._unsubscribeUrl,
      docsData: this._docsData,
      orgData: this._orgData,
    };

    new NotificationSender({
      templateName: RECAP_EMAIL_TEMPLATE,
      recipients,
      emailSubject,
      templateData,
    }).sendEmail({ isReportEnabled: true });
  }

  _getEmailSubject() {
    const date = getPrettyTzDate(this._recapDate, this._organization.timezone);
    return `Daily recap for ${date}`;
  }

  _getRecipients() {
    const orgMembers = this._organization.users.filter((userData) => {
      const {
        isRemoved, removedAt, removedBy, sendDailyRecap,
      } = userData;
      return !isRemoved && !removedAt && !removedBy && sendDailyRecap;
    });

    return _.pluck(orgMembers, 'userId');
  }
}
