import User from './User.graphql';
import Organization from './Organization.graphql';

export default [
  User,
  `
    type Query {
      files: [File]
    }
  `,
  Organization,
];
