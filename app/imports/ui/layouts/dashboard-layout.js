import { Template } from 'meteor/templating';

import { Organizations } from '/imports/share/collections/organizations.js';
import { OrgSubs, OrgSettingsDocSubs } from '/imports/startup/client/subsmanagers.js';


Template.Dashboard_Layout.viewmodel({
  mixin: 'organization',
  isReady: false,
  _subHandlers: [],
  autorun: [
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    },
    function() {
      this._subHandlers([
        OrgSubs.subscribe('currentUserOrganizationBySerialNumber', this.organizationSerialNumber(), {
          onReady: () => this.initBackgroundSubs()
        })
      ]);
    }
  ],
  initBackgroundSubs() {
    const organizationId = this.organizationId();

    // We need to fetch and cache these documents in background to decrease the loading time of other screens
    OrgSettingsDocSubs.subscribe('standards-book-sections', organizationId);
    OrgSettingsDocSubs.subscribe('standards-types', organizationId);
    OrgSettingsDocSubs.subscribe('riskTypes', organizationId);
    OrgSettingsDocSubs.subscribe('departments', organizationId);
  }
});
