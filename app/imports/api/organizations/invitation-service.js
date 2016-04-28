import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random';
import { Organizations } from './organizations.js';

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
      console.log('existing user', existingUser);
      let isInvited = Organizations.findOne({_id: this._organizationId, 'users.userId': existingUser._id});
      if (isInvited) {
        throw new Meteor.Error(500, `User with email ${this._userEmail} is already invited to organization`);
      }
    }

    return existingUser && existingUser._id;
  }

  _createNewUser(onUserCreated) {
    let handleCreateUserError = (err) => {
      let errorMsg = `Failed to create user ${this._userEmail}`;
      console.log(errorMsg, err);
      throw new Meteor.Error(500, errorMsg);
    };

    let _onUserCreated = (newUserId) => {
      Meteor.users.update({_id: newUserId}, {$set: {invitationId: this._invitationId}});
      onUserCreated(newUserId);
    };

    let randomPassword = Random.id(); //ID is enough random

    let userDoc = {
      email: this._userEmail,
      password: randomPassword,
      profile: {
        avatar: Utils.getRandomAvatarUrl()
      }
    };

    if (Meteor.isServer) {
      try {
        let newUserId = Accounts.createUser(userDoc);
        _onUserCreated(newUserId);
      } catch (err) {
        handleCreateUserError(err);
      }
    } else {
      return;
      // on client side there is no fibers so we are forced to use callbacks
      // we can rewrite it in callback fashion only to reduce amount of code
      Accounts.createUser(userDoc, (err, userId) => {
        if (err) {
          handleCreateUserError(err);
        } else {
          _onUserCreated(userId);
        }
      });
    }
  }

  _sendExistingUserInvite(userIdToInvite, notificationSubject, basicNotificationData) {
    //send notification
    let notificationData = Object.assign({
      organizationPageUrl: NotificationSender.getAbsoluteUrl(`/${this._organization.serialNumber}`)
    }, basicNotificationData);

    new NotificationSender(notificationSubject, 'invited-to-organization', notificationData)
      .sendEmail(userIdToInvite);
  }

  _sendNewUserInvite(userIdToInvite, notificationSubject, basicNotificationData) {
    // send invitation
    let notificationData = Object.assign({
      invitationLink: NotificationSender.getAbsoluteUrl(`/accept-invitation/${this._invitationId}`)
    }, basicNotificationData);

    new NotificationSender(notificationSubject, 'application-invitation', notificationData)
      .sendEmail(userIdToInvite);
  }

  _inviteUser(userIdToInvite, isExisting) {
    // add user to organization...
    Organizations.update({_id: this._organizationId}, {
      $addToSet: {
        users: {
          userId: userIdToInvite,
          role: 'member'
        }
      }
    });

    let sender = Meteor.user();
    let notificationSubject = `You were invited to ${this._organization.name} on Plio`;
    let basicNotificationData = {
      welcomeMessage: this._welcomeMessage,
      organizationName: this._organization.name,
      invitationSenderName: `${sender.profile.firstName} ${sender.profile.lastName}`
    };

    if (isExisting) {
      this._sendExistingUserInvite(userIdToInvite, notificationSubject, basicNotificationData);
    } else {
      this._sendNewUserInvite(userIdToInvite, notificationSubject, basicNotificationData);
    }
  }

  invite() {
    let userIdToInvite = this._findExistingUser();

    if (!userIdToInvite) {
      this._createNewUser(userId => {
        this._inviteUser(userId, false);
      });
    } else {
      this._inviteUser(userIdToInvite);
    }
  }
}

export default InvitationService = {
  inviteUserByEmail(organizationId, userEmail, welcomeMessage) {
    new InvitationSender(organizationId, userEmail, welcomeMessage).invite();
  },

  acceptInvitation(invitaionId, userData) {
    console.error('not implemented yet');
    return;
    //draft
    const password = userData.password;
    delete userData.password;
    let invitedUser = Meteor.users.findOne({invitationId: invitaionId});
    Meteor.users.update({_id: invitedUser._id}, {
      $set: userData,
      $unset: {invitationId: ''}
    });
    //todo: change password
    // Accounts.changePassword(null,password)
  }
};
