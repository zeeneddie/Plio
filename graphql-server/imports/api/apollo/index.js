import { Meteor } from 'meteor/meteor';
import { createApolloServer } from 'meteor/apollo';
import bodyParser from 'body-parser';
import cors from 'cors';

import schema from './apiSchema';
import * as collections from '../../share/collections';

const corsOptions = {
  origin: Meteor.settings.mainApp.url,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

createApolloServer(() => ({
  schema,
  context: {
    collections: {
      ...collections,
      Users: Meteor.users,
    },
  },
}), {
  graphiql: true,
  configServer: (graphQLServer) => {
    graphQLServer.use(cors(corsOptions));
    graphQLServer.use(bodyParser.json({ limit: '16mb' }));
    graphQLServer.use(bodyParser.urlencoded({ extended: false }));
  },
});
