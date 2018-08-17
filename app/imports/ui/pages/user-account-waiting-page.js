import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { sendVerificationEmail } from '../../api/users/methods.js';
import { handleMethodResult } from '../../api/helpers';

Template.UserAccountWaitingPage.viewmodel({
  isSendingEmail: false,
  isEmailVerified: false,
  emailToVerify: '',
  emailVerificationExpirationTimeInDays: Meteor.settings.public.emailVerificationExpirationTimeInDays || 3,
  autorun() {
    const currentUser = Meteor.user();
    if (currentUser) {
      this.emailToVerify(currentUser.emails[0].address);
      this.isEmailVerified(currentUser.emails[0].verified);
    }
  },
  sendVerificationEmail(e) {
    e.preventDefault();

    this.isSendingEmail(true);
    sendVerificationEmail.call({}, handleMethodResult((err) => {
      this.isSendingEmail(false);
      if (!err) {
        toastr.info('Verification email has been sent!');
      }
    }));
  },
});
