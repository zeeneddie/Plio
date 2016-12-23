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
    const emailSubject = `Password reset`;
    const secondaryText = `Your password was successfully reset`;

    const templateData = {
      title: emailSubject,
      secondaryText
    };

    new NotificationSender({
      recipients: this._userId,
      templateName: 'minimalisticEmail',
      emailSubject,
      templateData
    }).sendEmail();
  }

}
