import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Standards } from '/imports/share/collections/standards.js';
import { Organizations } from '/imports/share/collections/organizations.js';
import NotificationSender from '/imports/share/utils/NotificationSender';


export default class StandardsNotificationsSender {
  constructor(standardId) {
    this._standardId = standardId;
    this._standard = Standards.findOne({ _id: standardId });
    this._organization = Organizations.findOne({
      _id: this._standard.organizationId,
    });
  }

  addedToNotifyList(userId) {
    const emailSubject = `You have been added to the notification list for any changes to the Standards document "${this._standard.title}"`;
    const templateData = {
      organizationName: this._organization.name,
      title: emailSubject,
      button: {
        label: 'View standard',
        url: this.getStandardUrl(),
      },
    };

    new NotificationSender({
      recipients: userId,
      emailSubject,
      templateName: 'personalEmail',
      templateData,
      notificationData: {
        title: this._standard.title,
        body: 'You have been added to the notification list for any changes',
        url: this.getStandardUrl(),
      },
    }).sendOnSite().sendEmail();
  }

  removedFromNotifyList(userId) {

  }

  standardChanged() {

  }

  getStandardUrl() {
    return Meteor.absoluteUrl(`${this._organization.serialNumber}/standards/${this._standardId}`);
  }
}
