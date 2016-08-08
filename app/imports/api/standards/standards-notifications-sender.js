import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Standards } from './standards.js';
import { Organizations } from '../organizations/organizations.js';
import NotificationSender from '../../core/NotificationSender';


export default class StandardsNotificationsSender {
  constructor(standardId) {
    this._standardId = standardId;
    this._standard = Standards.findOne({ _id: standardId });
    this._organization = Organizations.findOne({
      _id: this._standard.organizationId
    });
  }

  addedToNotifyList(userId) {
    const emailSubject = `You have been added to the notification list for any changes to the Compliance standards document "${this._standard.title}"`;
    const templateData = {
      organizationName: this._organization.name,
      title: emailSubject,
      button: {
        label: 'View standard',
        url: this.getStandardUrl()
      }
    };
    if (userId !== this.userId) {
      new NotificationSender({
        recipients: userId,
        emailSubject,
        templateName: 'minimalisticEmail',
        templateData,
        notificationData: {
          title: this._standard.title,
          body: 'You have been added to the notification list for any changes',
          url: this.getStandardUrl()
        }
      }).sendOnSite().sendEmail()
    }
  }

  removedFromNotifyList(userId) {

  }

  standardChanged() {

  }

  getStandardUrl() {
    return Meteor.absoluteUrl(
      `${this._organization.serialNumber}/standards/${this._standardId}`
    );
  }
}
