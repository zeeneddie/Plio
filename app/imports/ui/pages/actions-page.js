import { Template } from 'meteor/templating';

Template.ActionsPage.viewmodel({
  share: 'window',
  mixin: ['mobile', 'organization'],
});
