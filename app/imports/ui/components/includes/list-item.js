import { Template } from 'meteor/templating';

Template.ListItem.viewmodel({
  collapsed: true,
  toggleCollapse: _.throttle(function() {
    this.collapse.collapse('toggle');
    this.collapsed(!this.collapsed());
  }, 500)
});
