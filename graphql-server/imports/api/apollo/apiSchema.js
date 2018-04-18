import { makeExecutableSchema } from 'graphql-tools';
import { loadSchema, getSchema } from 'graphql-loader';

import typeDefs from './schema';
import resolvers from './resolvers';

loadSchema({ typeDefs, resolvers });

const schema = makeExecutableSchema(getSchema());

if (process.env.NODE_ENV !== 'production' && parseInt(process.env.MOCK_SCHEMA, 10) === 1) {
  const { addMockFunctionsToSchema } = require('graphql-tools');
  const mocks = require('./schema/mocks').default;

  addMockFunctionsToSchema({
    schema,
    mocks,
    preserveResolvers: false,
  });
}

export default schema;
