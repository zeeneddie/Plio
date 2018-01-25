import { Organizations } from '../../share/collections/organizations';
import { createOrgQueryWhereUserIsMember } from '../../share/mongo/queries';
import { canChangeStandards } from './roles';

export const canChangeHelpDocs = (userId) => {
  const query = {
    isAdminOrg: true,
    ...createOrgQueryWhereUserIsMember(userId),
  };
  const { _id: adminOrgId } = Object.assign({}, Organizations.findOne(query));

  return !!adminOrgId && canChangeStandards(userId, adminOrgId);
};
