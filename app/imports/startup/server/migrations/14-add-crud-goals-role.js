import { Migrations } from 'meteor/percolate:migrations';

import { UserRoles, UserRolesNames } from '../../../share/constants';
import { addRolesToAllUsers, removeRolesFromAllUsers } from '../../../share/helpers';

export const up = () => {
  addRolesToAllUsers([UserRoles.CREATE_DELETE_GOALS]);
  console.log(`Added ${UserRoles.CREATE_DELETE_GOALS} to user roles`);
};

export const down = () => {
  removeRolesFromAllUsers([UserRoles.CREATE_DELETE_GOALS]);
  console.log(`Removed ${UserRoles.CREATE_DELETE_GOALS} from user roles`);
};

Migrations.add({
  up,
  down,
  version: 14,
  name: `Adds ${UserRolesNames[UserRoles.CREATE_DELETE_GOALS]} role to users`,
});
