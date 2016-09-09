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

  sendOwnershipInvite(newOwnerId, transferId, inviterId) {
    const orgName = this._organization.name;

    const emailSubject = `You have been invited to become an owner of the ${orgName} organization`;
    const secondaryText = `If you agree to be an organization owner, click on "Confirm" button`;

    const url = Meteor.absoluteUrl(`transfer-organization/${transferId}`);

    const templateData = {
      organizationName: orgName,
      title: emailSubject,
      secondaryText,
      button: {
        label: 'Confirm',
        url
      }
    };

    const inviter = Meteor.users.findOne({ _id: inviterId });
    const inviterName = inviter.fullNameOrEmail();

    const title = `You have been invited to become an organization owner`;
    const body = `${inviterName} invited you to become an owner of ${orgName} organization`;

    new NotificationSender({
      recipients: newOwnerId,
      emailSubject,
      templateData,
      templateName: 'minimalisticEmail',
      notificationData: { title, body, url }
    }).sendAll();
  }

  sendTransferInfo(newOwnerId, inviterId) {
    const orgName = this._organization.name;
    const newOwner = Meteor.users.findOne({ _id: newOwnerId });
    const newOwnerName = newOwner.fullNameOrEmail();

    const emailSubject = `Organization transferred`;
    const secondaryText = `${newOwnerName} accepted the invitation to become an owner of ${orgName} organization`;

    const templateData = {
      organizationName: orgName,
      title: emailSubject,
      secondaryText
    };

    const notificationData = {
      title: emailSubject,
      body: secondaryText
    };

    new NotificationSender({
      recipients: inviterId,
      templateName: 'minimalisticEmail',
      emailSubject,
      templateData,
      notificationData
    }).sendAll();
  }
}
