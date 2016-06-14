import { Template } from 'meteor/templating';

Template.NCPage.viewmodel({
  share: 'window',
  mixin: ['mobile', 'nonconformity']
});
