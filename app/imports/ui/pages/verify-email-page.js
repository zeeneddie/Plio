import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.VerifyEmailPage.viewmodel({
  error() {
    const error = AccountsTemplates.state.form.get('error');
    if (error && error[0]) {
      return error[0].replace('error.accounts.', '');
    }
  },
});
