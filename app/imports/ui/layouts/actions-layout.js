import { Template } from 'meteor/templating';

Template.ActionsLayout.viewmodel({
  mixin: ['organization', 'action'],
  _subHandlers: [],
  isReady: false,
  autorun: [
    function() {
      const orgSerialNumber = this.organizationSerialNumber();
      const org = this.organization();
      const { _id, users } = !!org && org;
      const userIds = _.pluck(users, 'userId');
      const _subHandlers = [
        this.templateInstance.subscribe('currentUserOrganizationBySerialNumber', orgSerialNumber),
        this.templateInstance.subscribe('organizationUsers', userIds),
        this.templateInstance.subscribe('actions', _id),
        this.templateInstance.subscribe('nonConformities', _id),
        this.templateInstance.subscribe('risks', _id),
      ];

      this._subHandlers(_subHandlers);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ]
});
