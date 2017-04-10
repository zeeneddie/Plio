import moment from 'moment-timezone';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { Organizations } from '/imports/share/collections/organizations';
import { getTimezones } from './helpers';
import ReviewReminderSender from '/imports/reminders/review/ReviewReminderSender';

SyncedCron.add({
  name: 'Send review reminders',

  schedule(parser) {
    return parser.text('at 05:00 pm'); // send reminders at 05:00 pm
  },

  job() {
    const todayDate = new Date();
    const todayMoment = moment(todayDate);
    const timezones = getTimezones(todayMoment.format('hh:mm'), todayDate);
    const query = { timezone: { $in: timezones } };

    Organizations.find(query).forEach(organization =>
      new ReviewReminderSender(organization, todayDate).send());
  },
});
