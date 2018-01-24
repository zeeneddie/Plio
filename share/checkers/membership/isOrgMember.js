import { Organizations } from '../../collections';
import { createOrgQueryWhereUserIsMember } from '../../mongo';

export default (organizationId, userId) => Organizations.findOne({
  organizationId,
  ...createOrgQueryWhereUserIsMember(userId),
});
