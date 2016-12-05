import { Template } from 'meteor/templating';
import { CollectionNames } from '/imports/share/constants';

Template.CardOrgChangelog.viewmodel({
  mixin: 'counter',
  organization: null,
  organizationId() {
    const { _id } = this.organization() || {};
    return _id;
  },
  onCreated(template) {
    template.autorun(() => {
      template.subscribe('lastHumanLog', this.organizationId(), CollectionNames.ORGANIZATIONS);
    });
  },
  subscribeForFirstLogs(onReady) {
    const organizationId = this.organizationId();
    const tpl = this.templateInstance;

    tpl.subscribe(
      'auditLogsCount',
      `audit-logs-count-${organizationId}`,
      organizationId,
      CollectionNames.ORGANIZATIONS,
    );

    tpl.subscribe('auditLogs', organizationId, { onReady });
  },
  subscribeForAllLogs(skip, onReady) {
    const organizationId = this.organizationId();
    const tpl = this.templateInstance;

    tpl.subscribe('auditLogs', organizationId, CollectionNames.ORGANIZATIONS, skip, 0, { onReady });
  },
  logsLength() {
    return this.get(`audit-logs-count-${this.organizationId()}`);
  }
});
