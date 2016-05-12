import { Template } from 'meteor/templating';

Template.DashboardHeader.viewmodel({
  mixin: 'organization',
  isReady: false,
  _subHandlers: [],
  autorun: [
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    },
    function() {
      this._subHandlers([
        this.templateInstance.subscribe('currentUserOrganizations')
      ]);
    }
  ]
})
