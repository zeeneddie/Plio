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
import NotificationSender from '/imports/share/utils/NotificationSender';


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

  _sendEmails() {
    if (_(this._logsMap).isEmpty()) {
      return;
    }

    const emailSubject = this._getEmailSubject();
    const recipients = this._getRecipients();

    const templateData = {
      organizationName: this._organization.name,
      title: emailSubject,
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
    const date = moment(log.date).tz(timezone).format('h:mm A');

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
      [CollectionNames.ACTIONS]: this._actionsIds,
    }[collection];

    set && set.add(documentId);
  }

  _getEmailSubject() {
    const { timezone } = this._organization;
    const date = moment(this._recapDate).tz(timezone).format('MMMM DD, YYYY');

    return `Daily recap for ${date}`;
  }

  _getRecipients() {
    const orgMembers = _(this._organization.users).filter((userData) => {
      const { isRemoved, removedAt, removedBy, sendDailyRecap } = userData;
      return !isRemoved && !removedAt && !removedBy && sendDailyRecap;
    });

    return _(orgMembers).pluck('userId');
  }

  _makeRecapData() {
    const { serialNumber } = this._organization;
    const mainAppUrl = Meteor.settings.mainApp.url;

    this._makeDocsData({
      collection: Standards,
      idsSet: this._standardsIds,
      docName: 'standard',
      descFn: doc => doc.title,
      urlFn: doc => Meteor.absoluteUrl(`${serialNumber}/standards/${doc._id}`, {
        rootUrl: mainAppUrl,
      }),
    });

    this._makeDocsData({
      collection: NonConformities,
      idsSet: this._ncsIds,
      docName: 'non-conformity',
      descFn: doc => `${doc.sequentialId} "${doc.title}"`,
      urlFn: doc => Meteor.absoluteUrl(`${serialNumber}/non-conformities/${doc._id}`, {
        rootUrl: mainAppUrl,
      }),
    });

    this._makeDocsData({
      collection: Actions,
      idsSet: this._actionsIds,
      docName: 'action',
      descFn: doc => `${doc.sequentialId} "${doc.title}"`,
      urlFn: (doc) => {
        const workItem = WorkItems.findOne({
          'linkedDoc._id': doc._id,
        }, {
          fields: { _id: 1 },
          sort: { createdAt: -1 },
        });
        if (workItem) {
          return Meteor.absoluteUrl(`${serialNumber}/work-inbox?id=${workItem._id}`, {
            rootUrl: mainAppUrl,
          });
        }
      },
    });

    this._makeDocsData({
      collection: Risks,
      idsSet: this._risksIds,
      docName: 'risk',
      descFn: doc => `${doc.sequentialId} "${doc.title}"`,
      urlFn: doc => Meteor.absoluteUrl(`${serialNumber}/risks/${doc._id}`, {
        rootUrl: mainAppUrl,
      }),
    });

    this._makeOrgData();
  }

  _makeDocsData({ collection, idsSet, docName, descFn, urlFn }) {
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
        logs: this._logsMap[doc._id],
      });
    });

    docsData = _(docsData).sortBy('desc');

    this._docsData.push({ title, docs: docsData });
  }

  _makeOrgData() {
    const orgLogs = this._logsMap[this._organizationId];
    if (!orgLogs) {
      return;
    }

    const title = 'Organization settings were updated:';

    this._orgData = {
      title,
      logs: orgLogs,
    };
  }

}
