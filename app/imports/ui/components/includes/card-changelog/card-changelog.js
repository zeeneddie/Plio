import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';

import { AuditLogs } from '/imports/api/audit-logs/audit-logs.js';
import { CollectionNames, SystemName } from '/imports/api/constants.js';


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
  resetProps() {
    this.collapsed(true);
    this.areLogsLoaded(false);
    this.loadingLogs(false);
    this.areAllLogsLoaded(false);
    this.loadingAllLogs(false);
    this.showAllLogs(false);
  },
  docCollection() {
    const collections = {
      action: CollectionNames.ACTIONS,
      nc: CollectionNames.NCS,
      risk: CollectionNames.RISKS,
      standard: CollectionNames.STANDARDS
    };

    return collections[this.documentType()];
  },
  toggleLogs() {
    if (this.areLogsLoaded()) {
      this.toggleCollapse();
    } else {
      this.loadingLogs(true);

      const documentId = this.documentId();
      const collectionName = this.docCollection();

      this.templateInstance.subscribe(
        'documentLogsCount',
        `document-logs-count-${documentId}`,
        documentId,
        collectionName
      );

      this.templateInstance.subscribe(
        'auditLogs',
        documentId,
        collectionName,
        {
          onReady: () => {
            this.loadingLogs(false);
            this.areLogsLoaded(true);
            this.toggleCollapse();
          }
        }
      );
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

      this.templateInstance.subscribe(
        'auditLogs',
        this.documentId(),
        this.docCollection(),
        this.limit(),
        0,
        {
          onReady: () => {
            this.loadingAllLogs(false);
            this.areAllLogsLoaded(true);
            this.showAllLogs(true);
          }
        }
      );
    }
  },
  viewRecentLogs() {
    this.showAllLogs(false);
  },
  viewButtonHidden() {
    return this.logsLength() <= this.limit();
  }
});
