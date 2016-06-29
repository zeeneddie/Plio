import { Template } from 'meteor/templating';

Template.ActionsList.viewmodel({
  share: 'search',
  mixin: ['search', 'collapsing', 'organization', 'modal', 'action', 'router'],
});
