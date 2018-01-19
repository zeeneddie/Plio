import User from './User.graphql';
import Organization from './Organization.graphql';
import Goal from './Goal.graphql';

export default [
  User,
  Organization,
  Goal,
  // TEMP
  `
    type Query {
      organizations: [Organization]
      actions: [Action]
      risks: [Risk]
    }
  `,
];
