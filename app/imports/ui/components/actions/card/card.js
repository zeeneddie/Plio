import { Template } from 'meteor/templating';

Template.ActionsCard.viewmodel({
  mixin: ['organization', 'action', 'user', 'date', 'modal', 'router', 'collapsing'],
});
