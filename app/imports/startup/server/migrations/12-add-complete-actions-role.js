import { Migrations } from 'meteor/percolate:migrations';

import { UserRoles, UserRolesNames } from '../../../share/constants';
import { addRolesToAllUsers, removeRolesFromAllUsers } from '../../../share/helpers';

export const up = () => {
  addRolesToAllUsers([UserRoles.COMPLETE_ANY_ACTION]);
  console.log(`Added ${UserRoles.COMPLETE_ANY_ACTION} to user roles`);
};

export const down = () => {
  removeRolesFromAllUsers([UserRoles.COMPLETE_ANY_ACTION]);
  console.log(`Removed ${UserRoles.COMPLETE_ANY_ACTION} from user roles`);
};

Migrations.add({
  up,
  down,
  version: 12,
  name: `Adds "${UserRolesNames[UserRoles.COMPLETE_ANY_ACTION]}" role to users`,
});
