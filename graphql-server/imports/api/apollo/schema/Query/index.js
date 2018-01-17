import User from './User.graphql';
import Organization from './Organization.graphql';

export default [
  User,
  Organization,
  `
    type Query {
      organizations: [Organization]
    }
  `,
];
