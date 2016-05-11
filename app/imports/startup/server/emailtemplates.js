import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.siteName = 'PLIO';
Accounts.emailTemplates.from     = 'PLIO <admin@pliohub.com>';

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return '[PLIO] Verify Your Email Address';
  },
  text(user, url) {
    const emailAddress = user.emails[0].address;
    const supportEmail = 'support@pliohub.com';
    const emailBody = `To verify your email address (${emailAddress}) visit the following link:\n\n${url}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

    return emailBody;
  }
};