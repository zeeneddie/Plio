import User from './User';

export default {
  ...User,
  files: (r, a, { collections: { Files } }) => Files.find().fetch(),
};
