import { Template } from 'meteor/templating';


Template.CardDocChangelog.viewmodel({
  mixin: 'counter',
  document: null,
  documentType: '',
  documentId() {
    const { _id } = this.document() || {};
    return _id;
  },
  onCreated(template) {
    template.autorun(() => {
      template.subscribe('lastHumanLog', this.documentId(), this.documentType());
    });
  },
  subscribeForFirstLogs(onReady) {
    const documentId = this.documentId();
    const documentType = this.documentType();
    const tpl = this.templateInstance;

    tpl.subscribe(
      'auditLogsCount',
      `doc-logs-count-${documentId}`,
      documentId,
      documentType
    );

    tpl.subscribe('auditLogs', documentId, documentType, { onReady });
  },
  subscribeForAllLogs(skip, onReady) {
    const documentId = this.documentId();
    const documentType = this.documentType();
    const tpl = this.templateInstance;

    tpl.subscribe('auditLogs', documentId, documentType, skip, 0, { onReady });
  },
  logsLength() {
    return this.get(`doc-logs-count-${this.documentId()}`);
  }
});
