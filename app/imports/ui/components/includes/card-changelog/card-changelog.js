import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';

import { AuditLogs } from '/imports/api/audit/audit-logs.js';
import { CollectionNames } from '/imports/api/constants.js';


Template.CardChangelog.viewmodel({
  mixin: ['collapse', 'counter', 'date', 'user'],
  isReady: false,
  showSpinner: false,
  autorun() {
    this.document.depend();
    this.collapsed(true);
    this.isReady(false);
  },
  toggleLogs() {
    if (this.isReady()) {
      this.toggleCollapse();
    } else {
      this.showSpinner(true);

      const documentId = this.document()._id;
      const collectionName = this.docCollection();

      this.templateInstance.subscribe(
        'auditLogs',
        documentId,
        collectionName,
        {
          onReady: () => {
            this.showSpinner(false);
            this.isReady(true);
            this.toggleCollapse();
          }
        }
      );

      this.templateInstance.subscribe(
        'documentLogsCount',
        `document-logs-count-${documentId}`,
        documentId,
        collectionName
      );
    }
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
  logs() {
    return AuditLogs.find({
      documentId: this.document()._id
    }, {
      sort: { date: -1 }
    });
  },
  getUser(userId) {
    if (userId === 'system') {
      return userId;
    } else {
      const user = Meteor.users.findOne({ _id: userId });
      return (user && user.fullNameOrEmail()) || userId;
    }
  },
  getPrettyDate(dateObj) {
    return this.renderDate(dateObj);
  },
  total() {
    return this.get(`document-logs-count-${this.document()._id}`);
  }
});
