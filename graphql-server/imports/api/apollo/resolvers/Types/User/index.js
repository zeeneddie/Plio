import {
  createOrgQueryWhereUserIsOwner,
  createOrgQueryWhereUserIsMember,
} from '../../../../../share/mongo';

export default {
  User: {
    email: ({ emails }) => emails[0].address,
    roles: ({ roles }, { organizationId }) => roles[organizationId],
    isPlioUser: async (root, args, context) => {
      const { _id: userId } = root;
      const { loaders: { Organization: { byQuery } } } = context;
      const organizations = await byQuery.load({
        isAdminOrg: true,
        ...createOrgQueryWhereUserIsMember(userId),
      });
      return !!organizations.length;
    },
    isPlioAdmin: async (root, args, context) => {
      const { _id: userId } = root;
      const { loaders: { Organization: { byQuery } } } = context;
      return !!(await byQuery.load({
        isAdminOrg: true,
        ...createOrgQueryWhereUserIsOwner(userId),
      })).length;
    },
  },
  UserProfile: {
    fullName: ({ firstName, lastName }) => `${firstName} ${lastName}`,
  },
};
