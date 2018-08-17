import { Organizations } from '../../collections';
import { createOrgQueryWhereUserIsMember } from '../../mongo';

export default async (organizationId, userId) => Organizations.findOne({
  _id: organizationId,
  ...createOrgQueryWhereUserIsMember(userId),
});
