import { Template } from 'meteor/templating';

Template.NCStatus.viewmodel({
  mixin: 'problemsStatus',
  status: 1
});
