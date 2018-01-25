import { Meteor } from 'meteor/meteor';
import { createApolloServer } from 'meteor/apollo';
import bodyParser from 'body-parser';
import cors from 'cors';

import schema from './apiSchema';
import { createLoaders } from './loaders';
import * as collections from '../../share/collections';
import * as services from '../../share/services';

const corsOptions = {
  origin: Meteor.settings.mainApp.url,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

createApolloServer(() => ({
  schema,
  context: ctx => ({
    ...ctx,
    services,
    collections: {
      ...collections,
      Users: Meteor.users,
    },
    loaders: createLoaders(),
  }),
}), {
  graphiql: true,
  configServer: (graphQLServer) => {
    graphQLServer.use(cors(corsOptions));
    graphQLServer.use(bodyParser.json({ limit: '16mb' }));
    graphQLServer.use(bodyParser.urlencoded({ extended: false }));
  },
});
