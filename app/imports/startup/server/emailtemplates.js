import { Accounts } from 'meteor/accounts-base';
import HandlebarsCompiledCache from '/imports/core/HandlebarsCompiledCache';

const getAssetPath = (type, name) => `notification-templates/${type}/${name}.handlebars`;
const handlebarsCache = Meteor.isServer ? new HandlebarsCompiledCache({
  minimalisticEmail: getAssetPath('email', 'minimalistic-email')
}) : false;

Accounts.emailTemplates.siteName = 'Plio';
Accounts.emailTemplates.from     = 'Plio<noreply@pliohub.com>';

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return 'Verify Your Email Address';
  },
  html(user, url) {
    return handlebarsCache.render('minimalisticEmail', {
      title: 'Welcome, ' + user.profile.firstName + '! Please click on the following button to confirm your email address:',
      button: {
        label: `Confirm '${user.emails[0].address}'`,
        url: url
      },
    });
  }
};

Accounts.emailTemplates.resetPassword = {
  subject() {
    return 'Reset Your Password';
  },
  html(user, url) {
    return handlebarsCache.render('minimalisticEmail', {
      title: 'Please click on the following button to create a new password:',
      button: {
        label: 'Reset Password',
        url: url
      },
    });
  }
};