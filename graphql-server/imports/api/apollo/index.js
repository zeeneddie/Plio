import { createApolloServer } from 'meteor/apollo';
import bodyParser from 'body-parser';
import schema from './apiSchema';

createApolloServer(() => ({
  schema,
  context: {},
}), {
  graphiql: true,
  configServer: (graphQLServer) => {
    graphQLServer.use(bodyParser.json({ limit: '16mb' }));
    graphQLServer.use(bodyParser.urlencoded({ extended: false }));
  },
});
