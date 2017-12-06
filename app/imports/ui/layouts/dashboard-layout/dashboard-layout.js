import { Template } from 'meteor/templating';

import { OrgSubs } from '/imports/startup/client/subsmanagers';

Template.Dashboard_Layout.viewmodel({
  mixin: 'organization',
  isReady: false,
  _subHandlers: [],
  autorun: [
    function () {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    },
    function () {
      if (typeof this.organizationSerialNumber() !== 'number') return;

      this._subHandlers([
        OrgSubs.subscribe('currentUserOrganizationBySerialNumber', this.organizationSerialNumber()),
      ]);
    },
  ],
});
