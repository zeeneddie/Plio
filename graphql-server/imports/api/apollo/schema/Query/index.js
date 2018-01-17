import User from './User.graphql';

export default [
  User,
  `
    type Query {
      files: [File]
    }
  `,
];
