import { loadUserById, getCreatedAt, getCreatedBy } from 'plio-util';

import users from './users';
import UserResolvers from '../User';

export default {
  Organization: {
    users,
    createdBy: loadUserById(getCreatedBy),
    updatedBy: loadUserById(getCreatedAt),
    customerType: (root, args, context) => {
      if (UserResolvers.User.isPlioUser({ _id: context.userId }, args, context)) {
        return root.customerType;
      }

      return null;
    },
  },
};
