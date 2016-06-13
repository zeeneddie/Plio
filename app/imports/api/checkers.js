import { Roles } from 'meteor/alanning:roles';

import { UserRoles } from './constants';


export const canChangeStandards = (userId, organizationId) => {
  return Roles.userIsInRole(
    userId,
    UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
    organizationId
  );
};
