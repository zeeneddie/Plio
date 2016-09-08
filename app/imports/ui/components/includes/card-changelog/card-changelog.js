import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';

import { AuditLogs } from '/imports/api/audit-logs/audit-logs.js';
import { SystemName } from '/imports/api/constants.js';


Template.CardChangelog.viewmodel({
  mixin: ['collapse', 'counter', 'date', 'user'],
  documentId: null,
  limit: 10,
  areLogsLoaded: false,
  loadingLogs: false,
  areAllLogsLoaded: false,
  loadingAllLogs: false,
  showAllLogs: false,
  autorun: [
    function() {
      this.documentId.depend();
      this.resetProps();
    },
    function() {
      const { _id } = this.document() || {};
      if (this.documentId.value !== _id) {
        this.documentId(_id);
      }
    }
  ],
  onCreated(template) {
    template.autorun(() => template.subscribe('lastUserLog', this.documentId()));
  },
  resetProps() {
    this.collapsed(true);
    this.areLogsLoaded(false);
    this.loadingLogs(false);
    this.areAllLogsLoaded(false);
    this.loadingAllLogs(false);
    this.showAllLogs(false);
  },
  lastUserLog() {
    return AuditLogs.findOne({
      documentId: this.documentId(),
      executor: { $ne: SystemName }
    }, {
      sort: { date: -1 }
    });
  },
  lastUserLogExecutor() {
    const log = this.lastUserLog();
    return log && log.executor;
  },
  lastUserLogDate() {
    const log = this.lastUserLog();
    return log && log.date;
  },
  toggleLogs() {
    if (this.areLogsLoaded()) {
      this.toggleCollapse();
    } else {
      this.loadingLogs(true);

      const documentId = this.documentId();
      const tpl = this.templateInstance;

      tpl.subscribe('documentLogsCount', `document-logs-count-${documentId}`, documentId);

      tpl.subscribe('auditLogs', documentId, {
        onReady: () => {
          this.loadingLogs(false);
          this.areLogsLoaded(true);
          this.toggleCollapse();
        }
      });
    }
  },
  logs() {
    const options = { sort: { date: -1 } };

    if (!this.showAllLogs()) {
      _(options).extend({ limit: this.limit() });
    }

    return AuditLogs.find({ documentId: this.documentId() }, options);
  },
  getUser(userId) {
    if (userId === SystemName) {
      return userId;
    } else {
      const user = Meteor.users.findOne({ _id: userId });
      return (user && user.fullNameOrEmail()) || userId;
    }
  },
  getPrettyDate(dateObj) {
    return this.renderDate(dateObj);
  },
  logsLength() {
    return this.get(`document-logs-count-${this.documentId()}`);
  },
  loadAllLogs() {
    if (this.areAllLogsLoaded()) {
      this.showAllLogs(true);
    } else {
      this.loadingAllLogs(true);
      const tpl = this.templateInstance;

      tpl.subscribe('auditLogs', this.documentId(), this.limit(), 0, {
        onReady: () => {
          this.loadingAllLogs(false);
          this.areAllLogsLoaded(true);
          this.showAllLogs(true);
        }
      });
    }
  },
  viewRecentLogs() {
    this.showAllLogs(false);
  },
  viewButtonHidden() {
    return this.logsLength() <= this.limit();
  }
});
