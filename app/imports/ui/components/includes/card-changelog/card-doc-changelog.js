import { Template } from 'meteor/templating';


Template.CardDocChangelog.viewmodel({
  mixin: 'counter',
  document: null,
  collection: '',
  documentId() {
    const { _id } = this.document() || {};
    return _id;
  },
  onCreated(template) {
    template.autorun(() => {
      const documentId = this.documentId();
      if (documentId) {
        template.subscribe('lastHumanLog', documentId, this.collection());
      }
    });
  },
  subscribeForFirstLogs(onReady) {
    const documentId = this.documentId();
    const collection = this.collection();
    const tpl = this.templateInstance;

    if (documentId) {
      tpl.subscribe(
        'auditLogsCount',
        `doc-logs-count-${documentId}`,
        documentId,
        collection,
      );

      tpl.subscribe('auditLogs', documentId, collection, { onReady });
    }
  },
  subscribeForAllLogs(skip, onReady) {
    const documentId = this.documentId();
    const collection = this.collection();
    const tpl = this.templateInstance;

    if (documentId) {
      tpl.subscribe('auditLogs', documentId, collection, skip, 0, { onReady });
    }
  },
  logsLength() {
    return this.get(`doc-logs-count-${this.documentId()}`);
  },
});
