import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random';
import { Roles } from 'meteor/alanning:roles';
import moment from 'moment-timezone';

import { Organizations } from '/imports/share/collections/organizations.js';
import { OrgMemberRoles, UserMembership } from '/imports/share/constants.js';
import { getRandomAvatarUrl, generateUserInitials } from '/imports/share/helpers';
import NotificationSender from '/imports/share/utils/NotificationSender';

import OrgNotificationsSender from './org-notifications-sender.js';

class InvitationSender {
  constructor(organizationId, userEmail, welcomeMessage) {
    this._organizationId = organizationId;
    this._organization = Organizations.findOne({ _id: organizationId });
    this._userEmail = userEmail;
    this._welcomeMessage = welcomeMessage;
    this._invitationId = Random.id();
    if (this._organization && this._organization.templateId) {
      this._template = Organizations.findOne({ _id: this._organization.templateId });
    }
  }

  _findExistingUser() {
    const existingUser = Meteor.users.findOne({
      emails: { address: this._userEmail, verified: true },
    });

    if (existingUser && !existingUser.invitationId) {
      // check if user already invited
      const isOrgMember = Organizations.findOne({
        _id: this._organizationId,
        users: {
          $elemMatch: {
            userId: existingUser._id,
            isRemoved: false,
            removedBy: { $exists: false },
            removedAt: { $exists: false },
          },
        },
      });
      if (isOrgMember) {
        throw new Meteor.Error(
          500,
          `User with email ${this._userEmail} is already invited to organization`,
        );
      }
    }

    return existingUser && existingUser._id;
  }

  _createNewUser() {
    const randomPassword = Random.id(); // ID is enough random

    const userDoc = {
      email: this._userEmail,
      password: randomPassword,
      profile: {
        avatar: getRandomAvatarUrl(),
        // We need to temporary set firstName and lastName,
        // because these fields are required by the schema.
        // When we use Accounts.createUser,
        // we have no way to skip schema validation.
        firstName: 'Invited',
        lastName: 'User',
      },
      isNotificationsEnabled: true,
    };

    try {
      const newUserId = Accounts.createUser(userDoc);
      const invitationExpirationDate = new Date();
      invitationExpirationDate.setDate(
        invitationExpirationDate.getDate() + InvitationSender.getInvitationExpirationTime(),
      );
      Meteor.users.update({
        _id: newUserId,
      }, {
        $set: {
          invitationId: this._invitationId,
          invitedAt: new Date(),
          invitedBy: Meteor.userId(),
          invitationExpirationDate,
          invitationOrgId: this._organizationId,
          'emails.0.verified': true,
          // unset firstName, lastName and initials
          'profile.firstName': '',
          'profile.lastName': '',
          'profile.initials': '',
        },
      }, {
        // Skip schema validation before update.
        // We need this to unset  "firstName" and "lastName",
        // beacause these fields are required by the schema.
        validate: false,
      });
      return newUserId;
    } catch (err) {
      const errorMsg = `Failed to create user ${this._userEmail}`;
      console.log(errorMsg, err);
      throw new Meteor.Error(500, errorMsg);
    }
  }

  _sendExistingUserInvite(userIdToInvite, emailSubject, basicNotificationData) {
    const sender = Meteor.user();

    // send notification
    const templateData = Object.assign({
      title: `${sender.profile.firstName} ${sender.profile.lastName} added you to the ${this._organization.name} management system.`,
      avatar: {
        alt: `${sender.profile.firstName} ${sender.profile.lastName}`,
        title: `${sender.profile.firstName} ${sender.profile.lastName}`,
        url: sender.profile.avatar,
      },
      secondaryText: this._welcomeMessage,
      button: {
        label: 'Visit this organization on Plio',
        url: NotificationSender.getAbsoluteUrl(`${this._organization.serialNumber}`),
      },
    }, basicNotificationData);

    new NotificationSender({
      recipients: userIdToInvite,
      emailSubject,
      templateData,
      templateName: 'personalEmail',
      options: { isImportant: true },
    })
      .sendEmail();
  }

  _sendNewUserInvite(userIdToInvite, emailSubject, basicNotificationData) {
    const sender = Meteor.user();
    const invitationExpiration = InvitationSender.getInvitationExpirationTime();
    const receiver = Meteor.users.findOne({ _id: userIdToInvite });
    const invitationId = receiver && receiver.invitationId || this._invitationId;
    const queryString = this._template ? `?template%3D${this._template.signupPath}` : '';
    const path = `accept-invitation/${invitationId}`;

    // send invitation
    const templateData = Object.assign({
      title: `${sender.profile.firstName} ${sender.profile.lastName} invited you to join the ${this._organization.name} management system.`,
      secondaryText: this._welcomeMessage,
      avatar: {
        alt: `${sender.profile.firstName} ${sender.profile.lastName}`,
        title: `${sender.profile.firstName} ${sender.profile.lastName}`,
        url: sender.profile.avatar,
      },
      button: {
        label: 'Accept the invitation',
        url: `${NotificationSender.getAbsoluteUrl(path)}${queryString}`,
      },
      footerText: `This invitation expires on ${moment().add(invitationExpiration, 'days').format('MMMM Do YYYY')}.`,
    }, basicNotificationData);

    new NotificationSender({
      recipients: userIdToInvite,
      emailSubject,
      templateName: 'personalEmail',
      templateData,
      options: { isImportant: true },
    })
      .sendEmail();
  }

  _inviteUser(userIdToInvite, isExisting) {
    // add user to organization...
    const wasInOrganization = Organizations.findOne({
      _id: this._organizationId,
      'users.userId': userIdToInvite,
    });

    if (wasInOrganization) {
      Organizations.update({
        _id: this._organizationId,
        'users.userId': userIdToInvite,
      }, {
        $set: {
          'users.$.isRemoved': false,
        },
        $unset: {
          'users.$.removedBy': '',
          'users.$.removedAt': '',
        },
      });
    } else {
      Organizations.update({
        _id: this._organizationId,
      }, {
        $addToSet: {
          users: {
            userId: userIdToInvite,
            role: UserMembership.ORG_MEMBER,
          },
        },
      });
    }

    Roles.addUsersToRoles(userIdToInvite, OrgMemberRoles, this._organizationId);

    let notificationSubject;
    const basicNotificationData = {
      organizationName: this._organization.name,
    };

    if (isExisting) {
      notificationSubject = `You have been added to the ${this._organization.name} management system`;
      this._sendExistingUserInvite(userIdToInvite, notificationSubject, basicNotificationData);
    } else {
      notificationSubject = `You have been invited to to join the ${this._organization.name} management system`;
      this._sendNewUserInvite(userIdToInvite, notificationSubject, basicNotificationData);
    }
  }

  invite() {
    let userIdToInvite = this._findExistingUser();

    if (!userIdToInvite) {
      userIdToInvite = this._createNewUser();
      this._inviteUser(userIdToInvite, false);
      return 1;
    }
    const userToInvite = Meteor.users.findOne({ _id: userIdToInvite });
    if (userToInvite && userToInvite.invitationId) {
      this._inviteUser(userIdToInvite, false);
      return 1;
    }
    this._inviteUser(userIdToInvite, true);
    return 2;
  }

  static getInvitationExpirationTime() {
    // 3 days by default
    return Meteor.settings.public.invitationExpirationTimeInDays || 3;
  }
}

export default {
  inviteUserByEmail(organizationId, userEmail, welcomeMessage) {
    const ret = new InvitationSender(organizationId, userEmail, welcomeMessage).invite();

    const inviterId = Meteor.userId();
    Meteor.defer(() =>
      new OrgNotificationsSender(organizationId).userInvited(userEmail, inviterId));

    return ret;
  },

  acceptInvitation(invitationId, userData) {
    const { password } = userData;
    delete userData.password; // eslint-disable-line no-param-reassign

    const invitedUser = Meteor.users.findOne({ invitationId });

    Object.assign(userData, { initials: generateUserInitials(userData) });

    if (invitedUser) {
      Accounts.setPassword(invitedUser._id, password);

      const updateUserProfile = Object.assign(invitedUser.profile, userData);
      Meteor.users.update({ _id: invitedUser._id }, {
        $set: { profile: updateUserProfile },
        $unset: {
          invitationId: '',
          invitationExpirationDate: '',
          invitationOrgId: '',
        },
      });

      Meteor.defer(() =>
        new OrgNotificationsSender(invitedUser.invitationOrgId).userAcceptedInvite(invitedUser));
    } else {
      throw new Meteor.Error(404, 'Invitation does not exist');
    }
  },

  getInvitationExpirationTime() {
    return InvitationSender.getInvitationExpirationTime();
  },
};
