import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { checkServerStatusAndReport } from './helpers';

const GRAPHQL_SERVER_URL = Meteor.settings.public.graphql.url;

SyncedCron.add({
  name: 'Check alive GraphQL server',

  schedule(parser) {
    return parser.text('every 30 minutes');
  },

  job() {
    checkServerStatusAndReport({
      url: GRAPHQL_SERVER_URL.replace('/graphql', ''),
      tmpFileName: 'graphql_server_prev_is_crashed',
      appName: 'GraphQL server',
    });
  },
});
