import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { sendVerificationEmail } from '../../api/users/methods.js';
import { handleMethodResult } from '../../api/helpers.js';

Template.UserAccountWaitingPage.viewmodel({
  sendVerificationEmail(e) {
    e.preventDefault();

    sendVerificationEmail.call({}, handleMethodResult((err) => {
      if (!err) {
        toastr.info('Verification email has been send');
      }
    }));
  }
});