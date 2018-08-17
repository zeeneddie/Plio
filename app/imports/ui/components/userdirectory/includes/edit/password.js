import { AccountsTemplates } from 'meteor/useraccounts:core';
import { Template } from 'meteor/templating';


Template.UserEdit_Password.viewmodel({
  mixin: 'collapse',
  togglePasswordSection() {
    AccountsTemplates.clearState();
    this.templateInstance.$('input[type="password"]').val('');
    this.toggleCollapse();
  },
});
