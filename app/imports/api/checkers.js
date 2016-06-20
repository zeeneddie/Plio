import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

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
  const areArgsValid = _.every([
    SimpleSchema.RegEx.Id.test(userId),
    SimpleSchema.RegEx.Id.test(organizationId)
  ]);

  if (!areArgsValid) {
    return false;
  }

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
