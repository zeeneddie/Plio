import { Template } from 'meteor/templating';

Template.NCLayout.viewmodel({
  mixin: ['organization', 'nonconformity'],
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
        this.templateInstance.subscribe('non-conformities', _id),
        this.templateInstance.subscribe('standards', _id),
        this.templateInstance.subscribe('lessons', _id),
        this.templateInstance.subscribe('departments', _id)
      ]);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ]
});
