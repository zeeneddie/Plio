import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { checkServerStatusAndReport } from './helpers';

const BACKGROUND_APP_URL = Meteor.settings.backgroundApp.url;

SyncedCron.add({
  name: 'Check alive background application',

  schedule(parser) {
    return parser.text('every 30 minutes');
  },

  job() {
    checkServerStatusAndReport({
      url: BACKGROUND_APP_URL,
      tmpFileName: 'background_prev_is_crashed',
      appName: 'Background application',
    });
  },
});
