export default {
  User: {
    email(user) {
      return user.emails[0].address;
    },
    roles: (user, { organizationId }) => user.roles[organizationId],
  },
  UserProfile: {
    fullName: ({ firstName, lastName }) => `${firstName} ${lastName}`,
  },
};
