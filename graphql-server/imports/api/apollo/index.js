import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { ApolloServer } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { PubSub } from 'graphql-subscriptions';

import schema from './apiSchema';
import { createLoaders } from './loaders';
import * as collections from '../../share/collections';
import * as services from '../../share/services';
import getUser from './util/getUser';

const pubsub = new PubSub();

const getContext = async (authorizationToken) => {
  const context = {
    services,
    collections: {
      ...collections,
      Users: Meteor.users,
    },
    pubsub,
  };
  const user = await getUser(authorizationToken);

  if (user) {
    Object.assign(context, { user, userId: user._id });
  }

  return {
    ...context,
    loaders: createLoaders(context),
  };
};

const server = new ApolloServer({
  schema,
  playground: {
    subscriptionEndpoint: Meteor.absoluteUrl('subscriptions').replace(
      /https?/,
      process.env.NODE_ENV === 'production' ? 'wss' : 'ws',
    ),
  },
  context: async ({ req }) => ({
    ...await getContext(req.headers['meteor-login-token']),
  }),
});

server.applyMiddleware({
  app: WebApp.connectHandlers,
  path: '/graphql',
  cors: {
    origin: Meteor.settings.mainApp.url,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  },
  bodyParser: {
    limit: '16mb',
    extended: false,
  },
});

/* eslint-disable no-new */
new SubscriptionServer({
  schema,
  execute,
  subscribe,
  onConnect: connectionParams => getContext(connectionParams['meteor-login-token']),
}, {
  server: WebApp.httpServer,
  path: '/subscriptions',
});

WebApp.connectHandlers.use('/graphql', (req, res) => {
  if (req.method === 'GET') {
    res.end();
  }
});
