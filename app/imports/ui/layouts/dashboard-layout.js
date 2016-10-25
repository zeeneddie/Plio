import { Template } from 'meteor/templating';

import { Organizations } from '/imports/share/collections/organizations.js';
import { OrgSubs } from '/imports/startup/client/subsmanagers.js';


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
        OrgSubs.subscribe('currentUserOrganizationBySerialNumber', this.organizationSerialNumber())
      ]);
    }
  ]
});
