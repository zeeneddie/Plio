import { Template } from 'meteor/templating';

Template.Subcards_Review_Edit.viewmodel({
  mixin: ['reviewStatus'],
  label: 'Review'
});
