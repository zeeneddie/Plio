import { createOrgQueryWhereUserIsOwner } from '../../mongo';
import { Organizations } from '../../collections';

export default (organizationId, userId) => {
  const query = {
    _id: organizationId,
    ...createOrgQueryWhereUserIsOwner(userId),
  };

  return !!Organizations.findOne(query);
};
