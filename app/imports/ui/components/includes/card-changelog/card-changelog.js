import { Template } from 'meteor/templating';

import { AuditLogs } from '/imports/share/collections/audit-logs.js';
import { SystemName } from '/imports/share/constants.js';


Template.CardChangelog.viewmodel({
  mixin: ['collapse', 'date', 'user'],
  documentId: null,
  documentType: '',
  limit: 10,
  areLogsLoaded: false,
  loadingLogs: false,
  areAllLogsLoaded: false,
  loadingAllLogs: false,
  showAllLogs: false,
  autorun: [
    function () {
      this.documentId.depend();
      this.resetProps();
    },
    function () {
      const { _id } = this.document() || {};
      if (this.documentId.value !== _id) {
        this.documentId(_id);
      }
    },
  ],
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
      executor: { $ne: SystemName },
    }, {
      sort: { date: -1 },
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

      this.parent().subscribeForFirstLogs(() => {
        this.loadingLogs(false);
        this.areLogsLoaded(true);
        this.toggleCollapse();
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
  logsLength() {
    return this.parent().logsLength();
  },
  getUser(userId) {
    if (userId === SystemName) {
      return userId;
    }
    const user = Meteor.users.findOne({ _id: userId });
    return (user && user.fullNameOrEmail()) || userId;
  },
  getPrettyDate(dateObj) {
    return this.renderDate(dateObj, 'DD MMM YYYY, h:mm A');
  },
  loadAllLogs() {
    if (this.areAllLogsLoaded()) {
      this.showAllLogs(true);
    } else {
      this.loadingAllLogs(true);

      this.parent().subscribeForAllLogs(this.limit(), () => {
        this.loadingAllLogs(false);
        this.areAllLogsLoaded(true);
        this.showAllLogs(true);
      });
    }
  },
  viewRecentLogs() {
    this.showAllLogs(false);
  },
  viewButtonHidden() {
    return this.logsLength() <= this.limit();
  },
});
