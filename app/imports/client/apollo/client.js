import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const GRAPHQL_URL = Meteor.settings.public.graphql.url;

const httpLink = new BatchHttpLink({ uri: GRAPHQL_URL });
const meteorAccountsLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      'meteor-login-token': Accounts._storedLoginToken(),
    },
  });
  return forward(operation);
});

const link = meteorAccountsLink.concat(httpLink);
const cache = new InMemoryCache().restore(window.__APOLLO_STATE__);

const client = new ApolloClient({
  link,
  cache,
});

export default client;
