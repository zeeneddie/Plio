import { Meteor, Accounts, Random } from 'meteor/meteor';
import { Organizations } from './organizations.js';
import { UserRoles } from '../constants.js';
import NotificationSender from '../../core/NotificationSender';

export default OrganizationService = {

  insert({name, ownerId}) {
    const lastOrg = Organizations.findOne({
      serialNumber: {
        $type: 16 // 32-bit integer
      }
    }, {
      sort: {
        serialNumber: -1
      }
    });

    const serialNumber = lastOrg ? lastOrg.serialNumber + 1 : 100;

    return Organizations.insert({
      name,
      serialNumber,
      users: [{
        userId: ownerId,
        role: UserRoles.OWNER
      }]
    });
  },

  update() {

  },

  remove() {

  },

  inviteUserByEmail(organizationId, userEmail) {
    //check if user exists ...
    let existingUser = Meteor.users.findOne({'emails.address': userEmail});
    let userIdToInvite = false;
    const invitationId = Random.id();

    if (existingUser) {
      //check if user already invited
      let isInvited = Organizations.findOne({_id: organizationId, 'users.userId': existingUser._id});
      if (isInvited) {
        throw new Meteor.Error(500, `User with email ${userEmail} is already invited to organization`);
      }

      userIdToInvite = existingUser._id;
    } else {
      //create new user
      let randomPassword = Random.id(); //ID is enough random
      userIdToInvite = Accounts.createUser({
        email: userEmail,
        password: randomPassword
      });

      Meteor.users.update({_id: userIdToInvite}, {$set: {invitationId: invitationId}});
    }

    // add user to organization...
    Organizations.update({_id: organizationId}, {
      $addToSet: {
        users: {
          userId: userIdToInvite,
          role: 'member'
        }
      }
    });

    let organization = Organizations.findOne({_id: organizationId});
    let sender = Meteor.user();
    let notificationSubject = `You were invited to ${organization.name} on Plio`;
    let basicNotificationData = {
      organizationName: organization.name,
      invitationSenderName: `${sender.profile.firstName} ${sender.profile.lastName}`
    };

    if (existingUser) {
      //send notification
      let notificationData = Object.assign({
        firstName: existingUser.profile.firstName || 'dear user',
        organizationPageUrl: NotificationSender.getAbsoluteUrl(`/${organization.serialNumber}`)
      }, basicNotificationData);

      new NotificationSender(notificationSubject, 'invited-to-organization', notificationData)
        .sendEmail(userIdToInvite);
    } else {
      // send invitation
      let notificationData = Object.assign({
        invitationLink: NotificationSender.getAbsoluteUrl(`/accept-invitation/${invitationId}`)
      }, basicNotificationData);

      new NotificationSender(notificationSubject, 'application-invitation', notificationData)
        .sendEmail(userIdToInvite);
    }
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


