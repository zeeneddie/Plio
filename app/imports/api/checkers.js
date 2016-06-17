import { Roles } from 'meteor/alanning:roles';

import { UserRoles } from './constants';
import { Organizations } from './organizations/organizations.js';


export const canChangeStandards = (userId, organizationId) => {
  return Roles.userIsInRole(
    userId,
    UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
    organizationId
  );
};

export const isOrgMember = (userId, organizationId) => {
  return !!Organizations.find({
    _id: organizationId,
    users: {
      $elemMatch: {
        userId,
        isRemoved: false,
        removedBy: { $exists: false },
        removedAt: { $exists: false }
      }
    }
  });
};
