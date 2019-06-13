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
      const organizationId = this.organizationId();
      if (organizationId) {
        template.subscribe('lastHumanLog', organizationId, CollectionNames.ORGANIZATIONS);
      }
    });
  },
  subscribeForFirstLogs(onReady) {
    const organizationId = this.organizationId();
    const tpl = this.templateInstance;

    if (organizationId) {
      tpl.subscribe(
        'auditLogsCount',
        `audit-logs-count-${organizationId}`,
        organizationId,
        CollectionNames.ORGANIZATIONS,
      );

      tpl.subscribe('auditLogs', organizationId, CollectionNames.ORGANIZATIONS, { onReady });
    }
  },
  subscribeForAllLogs(skip, onReady) {
    const organizationId = this.organizationId();
    const tpl = this.templateInstance;

    if (organizationId) {
      tpl.subscribe(
        'auditLogs',
        organizationId,
        CollectionNames.ORGANIZATIONS,
        skip,
        0,
        { onReady },
      );
    }
  },
  logsLength() {
    return this.get(`audit-logs-count-${this.organizationId()}`);
  },
});
