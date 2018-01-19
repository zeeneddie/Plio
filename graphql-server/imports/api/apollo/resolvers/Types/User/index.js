export default {
  User: {
    email(user) {
      return user.emails[0].address;
    },
  },
  UserProfile: {
    fullName: ({ firstName, lastName }) => `${firstName} ${lastName}`,
  },
};
