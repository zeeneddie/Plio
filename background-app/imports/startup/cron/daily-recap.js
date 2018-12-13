import { SyncedCron } from 'meteor/percolate:synced-cron';

import { Organizations } from '../../share/collections';
import { getTimezones } from './helpers';
import { sendDailyRecap } from '../../recaps/daily/sendDailyRecap';

// send recaps at 05:00
const RECAP_SENDING_TIME = '05:00';

SyncedCron.add({
  name: 'Send daily recap emails',

  schedule(parser) {
    return parser.text('every 15 mins');
  },

  job() {
    const timezones = getTimezones(RECAP_SENDING_TIME);

    Organizations.find({
      timezone: { $in: timezones },
    }, {
      fields: { _id: 1 },
    }).forEach((({ _id }) => sendDailyRecap(_id)));
  },
});
