import { Template } from 'meteor/templating';

Template.Actions_Status.viewmodel({
  mixin: 'actionStatus',
  status: 0,
});
