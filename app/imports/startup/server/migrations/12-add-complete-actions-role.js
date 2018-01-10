import { Migrations } from 'meteor/percolate:migrations';
import { Roles } from 'meteor/alanning:roles';

import { Organizations } from '../../../share/collections/organizations';
import { UserRoles } from '../../../share/constants';

export const up = () => {
  Organizations.find({}).forEach(({ _id: organizationId, users }) => {
    users.forEach(({ userId, isRemoved }) => {
      if (!isRemoved) {
        Roles.addUsersToRoles(userId, [UserRoles.COMPLETE_ACTIONS], organizationId);
      }
    });
  });

  console.log(`Added ${UserRoles.COMPLETE_ACTIONS} to user roles`);
};

export const down = () => {
  Organizations.find({}).forEach(({ _id: organizationId, users }) => {
    users.forEach(({ userId }) => {
      Roles.removeUsersFromRoles(userId, [UserRoles.COMPLETE_ACTIONS], organizationId);
    });
  });

  console.log(`Removed ${UserRoles.COMPLETE_ACTIONS} from user roles`);
};

Migrations.add({
  version: 12,
  name: 'Adds "Can complete any action" role to users',
  up,
  down,
});
