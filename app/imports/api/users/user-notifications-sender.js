import { Meteor } from 'meteor/meteor';

import NotificationSender from '/imports/share/utils/NotificationSender';


export default class UserNotificationsSender {
  constructor(userId) {
    this._userId = userId;
    this._user = Meteor.users.findOne({ _id: userId });
  }

  loginAttemptsExceeded() {
    console.log('login attempts exceeded');
  }

  passwordReset() {
    const emailSubject = 'Password reset';
    const title = 'Your password was successfully reset.';

    const templateData = {
      title,
    };

    new NotificationSender({
      recipients: this._userId,
      templateName: 'personalEmail',
      emailSubject,
      templateData,
      options: { isImportant: true },
    }).sendEmail();
  }
}
