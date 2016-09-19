import { Meteor } from 'meteor/meteor';

import NotificationSender from '../../core/NotificationSender';


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
    const secondaryText = `Your password was successfully changed`;

    const templateData = {
      organizationName: this._orgName,
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
