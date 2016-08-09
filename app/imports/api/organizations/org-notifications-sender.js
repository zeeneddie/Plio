import { Meteor } from 'meteor/meteor';

import { Organizations } from '../organizations/organizations.js';
import NotificationSender from '../../core/NotificationSender';


export default class OrgNotificationsSender {
  constructor(organizationId) {
    this._organizationId = organizationId;
    this._organization = Organizations.findOne({
      _id: organizationId
    });
  }

  sendOwnershipInvite(newOwnerId, transferId) {
    const orgName = this._organization.name;

    const emailSubject = `You have been invited to become an owner of the ${orgName} organization`;
    const secondaryText = `If you agree to be an organization owner, click on "Confirm" button`;

    const url = Meteor.absoluteUrl(`transfer-organization/${transferId}`);

    const templateData = {
      organizationName: orgName,
      title: subject,
      secondaryText,
      button: {
        label: 'Confirm',
        url
      }
    };

    new NotificationSender({ recipients: newOwnerId, emailSubject, templateData, templateName: 'minimalisticEmail' }).sendEmail();
  }
}
