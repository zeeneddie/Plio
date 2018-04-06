export default {
  User: {
    email: ({ emails }) => emails[0].address,
    roles: ({ roles }, { organizationId }) => roles[organizationId],
  },
  UserProfile: {
    fullName: ({ firstName, lastName }) => `${firstName} ${lastName}`,
  },
};
