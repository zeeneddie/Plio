import { Template } from 'meteor/templating';

Template.Review_Status.viewmodel({
  mixin: 'reviewStatus',
  label: 'Status',
  status: 2
});
