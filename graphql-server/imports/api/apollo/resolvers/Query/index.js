import User from './User';

export default {
  ...User,
  organizations: (r, a, { collections: { Organizations } }) => Organizations.find().fetch(),
};
