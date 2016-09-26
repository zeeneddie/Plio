import moment from 'moment-timezone';

import { Organizations } from '/imports/share/collections/organizations.js';
import ReminderSender from '/imports/core/reminders/server/ReminderSender.js';


// send reminders at 00:00
const REMINDERS_SENDING_HOUR = 0;

SyncedCron.add({
  name: 'Send reminders',

  schedule(parser) {
    return parser.text('every 15 mins');
  },

  job() {
    const timezones = _(moment.tz.names()).filter((name) => {
      return moment().tz(name).hours() === REMINDERS_SENDING_HOUR;
    });

    Organizations.find({ timezone: { $in: timezones } }).forEach((org) => {
      new ReminderSender(org._id).send();
    });
  }
});
