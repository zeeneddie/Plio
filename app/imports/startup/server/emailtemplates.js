import moment from 'moment-timezone';
import { Accounts } from 'meteor/accounts-base';
import EmailTemplates from '/imports/share/utils/email-templates.js';


Accounts.emailTemplates.siteName = 'Plio';
Accounts.emailTemplates.from     = 'Plio<noreply@pliohub.com>';

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return 'Verify Your Email Address';
  },
  html(user, url) {

    // 3 days by default
    const emailConfirmationExpirationInHours = Meteor.settings.emailConfirmationExpirationInHours || 72;

    return EmailTemplates.render('personalEmail', {
      title: 'Welcome, ' + user.profile.firstName + '! Please click on the following link to confirm your email address:',
      button: {
        label: `Confirm '${user.emails[0].address}'`,
        url: url
      },
      footerText: `This link expires on ${moment().add(emailConfirmationExpirationInHours, 'hours').format('MMMM Do YYYY')}`
    });
  }
};

Accounts.emailTemplates.resetPassword = {
  subject() {
    return 'Reset Your Password';
  },
  html(user, url) {
    return EmailTemplates.render('personalEmail', {
      title: 'Please click on the following link to create a new password:',
      button: {
        label: 'Reset Password',
        url: url
      },
    });
  }
};
