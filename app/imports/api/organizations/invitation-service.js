import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random';
import { Roles } from 'meteor/alanning:roles';
import { Organizations } from './organizations.js';
import { OrgMemberRoles, UserMembership } from '../constants.js';

import Utils from '/imports/core/utils';
import NotificationSender from '../../core/NotificationSender';


class InvitationSender {
  constructor(organizationId, userEmail, welcomeMessage) {
    this._organizationId = organizationId;
    this._organization = Organizations.findOne({_id: organizationId});
    this._userEmail = userEmail;
    this._welcomeMessage = welcomeMessage;
    this._invitationId = Random.id();
  }

  _findExistingUser() {
    let existingUser = Meteor.users.findOne({'emails.address': this._userEmail});

    if (existingUser) {
      //check if user already invited
      let isOrgMember = Organizations.findOne({
        _id: this._organizationId,
        users: {
          $elemMatch: {
            userId: existingUser._id,
            isRemoved: false,
            removedBy: {$exists: false},
            removedAt: {$exists: false}
          }
        }
      });
      if (isOrgMember) {
        throw new Meteor.Error(500, `User with email ${this._userEmail} is already invited to organization`);
      }
    }

    return existingUser && existingUser._id;
  }

  _createNewUser() {
    let randomPassword = Random.id(); //ID is enough random

    let userDoc = {
      email: this._userEmail,
      password: randomPassword,
      profile: {
        avatar: Utils.getRandomAvatarUrl()
      }
    };

    try {
      const newUserId = Accounts.createUser(userDoc);
      let invitationExpirationDate = new Date;
      invitationExpirationDate.setDate(invitationExpirationDate.getDate() + InvitationSender.getInvitationExpirationTime());
      Meteor.users.update({
        _id: newUserId,
      }, {
        $set: {
          invitationId: this._invitationId,
          invitedAt: new Date(),
          invitedBy: Meteor.userId(),
          invitationExpirationDate,
          'emails.0.verified': true
        }
      });
      return newUserId;
    } catch (err) {
      const errorMsg = `Failed to create user ${this._userEmail}`;
      console.log(errorMsg, err);
      throw new Meteor.Error(500, errorMsg);
    }
  }

  _sendExistingUserInvite(userIdToInvite, notificationSubject, basicNotificationData) {
    let sender = Meteor.user();

    //send notification
    let notificationData = Object.assign({
      title: `${sender.profile.firstName} ${sender.profile.lastName} added you to the ${this._organization.name} management system.`,
      avatar: {
        alt: `${sender.profile.firstName} ${sender.profile.lastName}`,
        title: `${sender.profile.firstName} ${sender.profile.lastName}`,
        url: sender.profile.avatar
      },
      secondaryText: this._welcomeMessage,
      button: {
        label: 'Visit this organization on Plio',
        url: NotificationSender.getAbsoluteUrl(`${this._organization.serialNumber}`)
      }
    }, basicNotificationData);

    new NotificationSender(notificationSubject, 'minimalisticEmail', notificationData)
      .sendEmail(userIdToInvite);
  }

  _sendNewUserInvite(userIdToInvite, notificationSubject, basicNotificationData) {
    let sender = Meteor.user();
    let invitationExpirationInHours = InvitationSender.getInvitationExpirationTime();

    // send invitation
    let notificationData = Object.assign({
      title: `${sender.profile.firstName} ${sender.profile.lastName} invited you to join the ${this._organization.name} compliance management system.`,
      secondaryText: this._welcomeMessage,
      avatar: {
        alt: `${sender.profile.firstName} ${sender.profile.lastName}`,
        title: `${sender.profile.firstName} ${sender.profile.lastName}`,
        url: sender.profile.avatar
      },
      button: {
        label: 'Accept the invitation',
        url: NotificationSender.getAbsoluteUrl(`accept-invitation/${this._invitationId}`)
      },
      footerText: `This invitation expires on ${moment().add(invitationExpirationInHours, 'hours').format('MMMM Do YYYY')}.`
    }, basicNotificationData);

    new NotificationSender(notificationSubject, 'minimalisticEmail', notificationData)
      .sendEmail(userIdToInvite);
  }

  _inviteUser(userIdToInvite, isExisting) {
    // add user to organization...
    const wasInOrganization = Organizations.findOne({
      _id: this._organizationId,
      'users.userId': userIdToInvite
    });

    if (wasInOrganization) {
      Organizations.update({
        _id: this._organizationId,
        'users.userId': userIdToInvite
      }, {
        $set: {
          'users.$.isRemoved': false
        },
        $unset: {
          'users.$.removedBy': '',
          'users.$.removedAt': ''
        }
      });
    } else {
      Organizations.update({
        _id: this._organizationId
      }, {
        $addToSet: {
          users: {
            userId: userIdToInvite,
            role: UserMembership.ORG_MEMBER,
            isRemoved: false
          }
        }
      });
    }

    Roles.addUsersToRoles(userIdToInvite, OrgMemberRoles, this._organizationId);

    let sender = Meteor.user();
    let notificationSubject;
    let basicNotificationData = {
      organizationName: this._organization.name
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
    } else {
      this._inviteUser(userIdToInvite, true);
    }
  }

  static getInvitationExpirationTime() {

    // 3 days by default
    return Meteor.settings.public.invitationExpirationTimeInDays || 3;  
  }
}

export default InvitationService = {
  inviteUserByEmail(organizationId, userEmail, welcomeMessage) {
    new InvitationSender(organizationId, userEmail, welcomeMessage).invite();
  },

  acceptInvitation(invitationId, userData) {
    const password = userData.password;
    delete userData.password;

    let invitedUser = Meteor.users.findOne({invitationId: invitationId});

    userData.initials = Utils.generateUserInitials(userData);

    if (invitedUser) {
      Accounts.setPassword(invitedUser._id, password);

      let updateUserProfile = Object.assign(invitedUser.profile, userData);
      Meteor.users.update({_id: invitedUser._id}, {
        $set: {profile: updateUserProfile},
        $unset: {
          invitationId: '',
          invitationExpirationDate: ''
        }
      });
    } else {
      throw new Meteor.Error(404, 'Invitation does not exist');
    }
  },

  getInvitationExpirationTime() {
    return InvitationSender.getInvitationExpirationTime();
  }
};
