import { Meteor } from 'meteor/meteor';
import moment from 'moment-timezone';
import { Organizations } from '/imports/share/collections/organizations.js';
import NotificationSender from '/imports/share/utils/NotificationSender';
import { EmailsForPlioReporting, PlioS3Logos } from '/imports/share/constants';


export default class OrgNotificationsSender {
  constructor(organizationId) {
    this._organizationId = organizationId;
    this._organization = Organizations.findOne({
      _id: organizationId,
    });
    this._orgName = this._organization.name;
    this._orgOwnerId = this._organization.ownerId();
  }

  orgCreated() {
    const ownerDetail = Meteor.users.findOne({ _id: this._orgOwnerId });
    const { firstName, lastName } = ownerDetail.profile;

    const emailSubject = 'New Plio organization created';
    const secondaryText = `Owner: ${firstName} ${lastName}; ` +
      `Email: ${_.first(ownerDetail.emails).address}; ` +
      `Created: ${moment(this._organization.createdAt).format('DD MMM YYYY')}`;

    new NotificationSender({
      recipients: EmailsForPlioReporting,
      emailSubject,
      templateData: {
        secondaryText,
        title: this._orgName,
        organizationName: this._orgName,
        avatar: {
          alt: 'Plio',
          url: PlioS3Logos.square,
        },
      },
      templateName: 'personalEmail',
    }).sendEmail();
  }

  transferCreated(newOwnerId, transferId, inviterId) {
    const emailSubject = `You have been invited to become an owner of the ${this._orgName} organization`;
    const secondaryText = 'If you agree to be an organization owner, click on "Accept the invitation" link.';

    const url = Meteor.absoluteUrl(`transfer-organization/${transferId}`);

    const templateData = {
      organizationName: this._orgName,
      title: `${emailSubject}.`,
      secondaryText,
      button: {
        label: 'Accept the invitation',
        url,
      },
    };

    const inviter = Meteor.users.findOne({ _id: inviterId });
    const inviterName = inviter.fullNameOrEmail();

    const title = 'You have been invited to become an organization owner';
    const body = `${inviterName} invited you to become an owner of ${this._orgName} organization`;

    new NotificationSender({
      recipients: newOwnerId,
      emailSubject,
      templateData,
      templateName: 'personalEmail',
      notificationData: { title, body, url },
      options: { isImportant: true },
    }).sendAll();
  }

  transferCompleted(newOwnerId, inviterId) {
    const newOwner = Meteor.users.findOne({ _id: newOwnerId });
    const newOwnerName = newOwner.fullNameOrEmail();

    const emailSubject = 'Organization transferred';
    const title = `${newOwnerName} accepted the invitation to become an owner of ${this._orgName} organization.`;

    const templateData = {
      organizationName: this._orgName,
      title,
    };

    const notificationData = {
      title: emailSubject,
      body: title,
    };

    new NotificationSender({
      recipients: inviterId,
      templateName: 'personalEmail',
      emailSubject,
      templateData,
      notificationData,
      options: { isImportant: true },
    }).sendAll();
  }

  userInvited(email, inviterId) {
    if (this._orgOwnerId === inviterId) {
      return;
    }

    const inviter = Meteor.users.findOne({ _id: inviterId });
    const inviterName = inviter.fullNameOrEmail();

    const emailSubject = 'New user invited to the organization';
    const title = `${inviterName} invited user "${email}" to ${this._orgName} organization.`;

    const templateData = {
      organizationName: this._orgName,
      title,
    };

    const notificationData = {
      title: emailSubject,
      body: title,
    };

    new NotificationSender({
      recipients: this._orgOwnerId,
      templateName: 'personalEmail',
      emailSubject,
      templateData,
      notificationData,
      options: { isImportant: true },
    }).sendAll();
  }

  userAcceptedInvite(user) {
    const { invitedBy } = user;
    const userName = user.fullNameOrEmail();

    let recipients = new Set([this._orgOwnerId, invitedBy]);
    recipients = Array.from(recipients);

    const emailSubject = 'New user accepted invitation to the organization';
    const title = `${userName} accepted invitation to the ${this._orgName} organization.`;

    const templateData = {
      organizationName: this._orgName,
      title,
    };

    const notificationData = {
      title: emailSubject,
      body: title,
    };

    new NotificationSender({
      recipients,
      templateName: 'personalEmail',
      emailSubject,
      templateData,
      notificationData,
      options: { isImportant: true },
    }).sendAll();
  }

  userRemoved(userId, removedBy) {
    if (this._orgOwnerId === removedBy) {
      return;
    }

    const user = Meteor.users.findOne({ _id: userId });
    const userName = user.fullNameOrEmail();

    const executor = Meteor.users.findOne({ _id: removedBy });
    const executorName = executor.fullNameOrEmail();

    const emailSubject = 'User removed from the organization';
    const title = `${executorName} removed ${userName} from the ${this._orgName} organization.`;

    const templateData = {
      organizationName: this._orgName,
      title,
    };

    const notificationData = {
      title: emailSubject,
      body: title,
    };

    new NotificationSender({
      recipients: this._orgOwnerId,
      templateName: 'personalEmail',
      emailSubject,
      templateData,
      notificationData,
      options: { isImportant: true },
    }).sendAll();
  }
}
