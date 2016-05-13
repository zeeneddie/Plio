import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.StandardsLayout.viewmodel({
  share: 'standard',
  mixin: ['organization', 'standard'],
  _subHandlers: [],
  isReady: false,
  autorun: [
    function() {
      const org = this.organization();
      const standard = this.currentStandard();
      const { _id, users } = !!org && org;
      const userIds = _.pluck(users, 'userId');
      this._subHandlers([
        this.templateInstance.subscribe('currentUserOrganizations'),
        this.templateInstance.subscribe('standards', _id),
        this.templateInstance.subscribe('lessons', standard && standard._id),
        this.templateInstance.subscribe('organizationUsers', userIds)
      ]);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ]
});
