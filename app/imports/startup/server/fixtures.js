import { Meteor } from 'meteor/meteor';
import { Organizations } from '../../api/organizations/organizations.js';
import OrganizationService from '../../api/organizations/organization-service.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  if (!Meteor.users.findOne({ $or: [{ 'emails.address': 'dummy1@pliohub.com' }, { 'emails.address': 'dummy2@pliohub.com' }] })) {
    const userId1 = Accounts.createUser({
      email: 'dummy1@pliohub.com',
      profile: {
        fullName: 'Dummy User 1'
      },
      password: 'password'
    });

    console.log('User "Dummy User 1" has been created!');

    const userId2 = Accounts.createUser({
      email: 'dummy2@pliohub.com',
      profile: {
        fullName: 'Dummy User 2'
      },
      password: 'password'
    });

    console.log('User "Dummy User 2" has been created!');

    const organizations = [{
      name: 'Dummy Organization',
      ownerId: userId1,
      'users' : [{
        'userId' : userId1,
        'role' : 'owner'
      }]
    }, {
      name: 'Dummy Inviter Organization',
      ownerId: userId2,
      'users' : [{
        'userId' : userId1,
        'role' : 'member'
      }, {
        'userId': userId2,
        'role': 'owner'
      }]
    }];

    organizations.forEach((organization) => {
      const organizationId = OrganizationService.insert({
        name: organization.name,
        ownerId: organization.ownerId
      });

      Organizations.update({ _id: organizationId }, { $set: { users: organization.users } });

      console.log('Organization "' + organization.name + '" has been created!');
    });
  }
});