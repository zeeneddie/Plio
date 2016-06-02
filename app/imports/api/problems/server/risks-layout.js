import { Template } from 'meteor/templating';

Template.RisksLayout.viewmodel({
  mixin: 'organization',
  _subHandlers: [],
  isReady: false,
  autorun: [
    function() {
      const orgSerialNumber = this.organizationSerialNumber();
      const org = this.organization();
      const { _id, users } = !!org && org;
      const userIds = _.pluck(users, 'userId');

      this._subHandlers([
        this.templateInstance.subscribe('currentUserOrganizationBySerialNumber', orgSerialNumber),
        this.templateInstance.subscribe('organizationUsers', userIds),
        this.templateInstance.subscribe('risks-sections', _id),
        this.templateInstance.subscribe('risks', _id)
      ]);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ]
});
