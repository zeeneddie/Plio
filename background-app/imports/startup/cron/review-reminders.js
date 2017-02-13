import { SyncedCron } from 'meteor/percolate:synced-cron';

import { Organizations } from '/imports/share/collections/organizations';
import { getTimezones } from './helpers';
import ReviewReminderSender from '/imports/reminders/review/ReviewReminderSender';


// send reminders at 05:00
const REMINDERS_SENDING_TIME = '05:00';

SyncedCron.add({
  name: 'Send review reminders',

  schedule(parser) {
    return parser.text('every 15 mins');
  },

  job() {
    const timezones = getTimezones(REMINDERS_SENDING_TIME);
    const query = { timezone: { $in: timezones } };
    const options = { fields: { _id: 1 } };

    Organizations.find(query, options).forEach((org) => {
      new ReviewReminderSender(org._id).send();
    });
  },
});
