import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';


Template.UserDirectoryLayout.viewmodel({
  share: 'organization',
  mixin: 'organization',
  isReady: false,
  _subHandlers: null,
  onCreated() {
    this._subHandlers = [
      this.templateInstance.subscribe('currentUserOrganizationBySerialNumber', this.organizationSerialNumber())
    ];
  },
  autorun: [
    function () {
      this.isReady(this._subHandlers.every(handle => handle.ready()));
    }
  ]
});
