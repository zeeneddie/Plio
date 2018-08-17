import { Template } from 'meteor/templating';

Template.NC_Status_Edit.viewmodel({
  mixin: 'problemsStatus',
  status: 1,
});
