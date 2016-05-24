import { Meteor } from 'meteor/meteor';

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
    const subject = `You have been added to the notification list for any changes to the Compliance standards document "${this._standard.title}"`;
    const options = {
      organizationName: this._organization.name,
      title: subject,
      button: {
        label: 'View standard',
        url: this.getStandardUrl()
      }
    };
    new NotificationSender(subject, 'minimalisticEmail', options).sendEmail(userId);
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
