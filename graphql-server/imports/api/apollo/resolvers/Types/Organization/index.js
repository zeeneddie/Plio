import { loadUserById, getCreatedAt, getCreatedBy } from 'plio-util';

import users from './users';

export default {
  Organization: {
    users,
    createdBy: loadUserById(getCreatedBy),
    updatedBy: loadUserById(getCreatedAt),
  },
};
