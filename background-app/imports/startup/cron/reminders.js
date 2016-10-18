import { Organizations } from '/imports/share/collections/organizations.js';
import { getTimezones } from './helpers';
import ReminderSender from '/imports/reminders/ReminderSender.js';


// send reminders at 05:00
const REMINDERS_SENDING_TIME = '05:00';

SyncedCron.add({
  name: 'Send reminders',

  schedule(parser) {
    return parser.text('every 15 mins');
  },

  job() {
    const timezones = getTimezones(REMINDERS_SENDING_TIME);

    Organizations.find({
      timezone: { $in: timezones }
    }, {
      fields: { _id: 1 }
    }).forEach((org) => {
      new ReminderSender(org._id).send();
    });
  }
});
