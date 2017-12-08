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
      template.subscribe('lastHumanLog', this.documentId(), this.collection());
    });
  },
  subscribeForFirstLogs(onReady) {
    const documentId = this.documentId();
    const collection = this.collection();
    const tpl = this.templateInstance;

    tpl.subscribe(
      'auditLogsCount',
      `doc-logs-count-${documentId}`,
      documentId,
      collection,
    );

    tpl.subscribe('auditLogs', documentId, collection, { onReady });
  },
  subscribeForAllLogs(skip, onReady) {
    const documentId = this.documentId();
    const collection = this.collection();
    const tpl = this.templateInstance;

    tpl.subscribe('auditLogs', documentId, collection, skip, 0, { onReady });
  },
  logsLength() {
    return this.get(`doc-logs-count-${this.documentId()}`);
  },
});
