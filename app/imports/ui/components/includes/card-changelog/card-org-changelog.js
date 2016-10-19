import { Template } from 'meteor/templating';


Template.CardOrgChangelog.viewmodel({
  mixin: 'counter',
  organization: null,
  organizationId() {
    const { _id } = this.organization() || {};
    return _id;
  },
  onCreated(template) {
    template.autorun(() => {
      template.subscribe('orgLastUserLog', this.organizationId());
    });
  },
  subscribeForFirstLogs(onReady) {
    const organizationId = this.organizationId();
    const tpl = this.templateInstance;

    tpl.subscribe(
      'orgLogsCount',
      `org-logs-count-${organizationId}`,
      organizationId
    );

    tpl.subscribe('orgAuditLogs', organizationId, { onReady });
  },
  subscribeForAllLogs(skip, onReady) {
    const organizationId = this.organizationId();
    const tpl = this.templateInstance;

    tpl.subscribe('orgAuditLogs', organizationId, skip, 0, { onReady });
  },
  logsLength() {
    return this.get(`org-logs-count-${this.organizationId()}`);
  }
});
