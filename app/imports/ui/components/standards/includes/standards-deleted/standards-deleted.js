import { Template } from 'meteor/templating';

Template.StandardsDeletedListWrapper.viewmodel({
  mixin: ['standard', 'organization', 'router', 'collapsing'],
  onRendered() {
    const vms = ViewModel.find('ListSubItem', vm => vm._id && vm._id() === this.standardId());
    if ( (!!vms && vms.length === 0 && !!this.standardId()) || !this.standardId() ) {
      const items = this.items().fetch();
      if (items.length > 0) {
        const { _id } = items[0];
        Meteor.setTimeout(() => {
          this.goToStandard(_id);
          this.expandCollapsedStandard(_id);
        }, 0);
      }
    }
  }
});
