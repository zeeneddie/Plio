import { getUserJoinedAt } from 'plio-util';

import { Organizations } from '../collections';

export const getJoinUserToOrganizationDate = ({ organizationId, userId }) =>
  getUserJoinedAt(userId, Organizations.findOne({ _id: organizationId }));
