import { makeExecutableSchema } from 'graphql-tools';
import { loadSchema, getSchema } from 'graphql-loader';

import typeDefs from './schema';
import resolvers from './resolvers';

loadSchema({ typeDefs, resolvers });

const schema = makeExecutableSchema(getSchema());

export default schema;
