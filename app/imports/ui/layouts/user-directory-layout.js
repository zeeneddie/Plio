import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';


Template.UserDirectory_Layout.viewmodel({
  share: 'organization',
  mixin: 'organization',
  isReady: false,
  _subHandlers: [],
  autorun: [
    function() {
      this._subHandlers([
        this.templateInstance.subscribe('currentUserOrganizationBySerialNumber', this.organizationSerialNumber())
      ]);
    },
    function () {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ]
});
