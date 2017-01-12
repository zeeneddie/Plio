import { Organizations } from '/imports/share/collections/organizations';
import { getTimezones } from './helpers';
import ActionCreationReminderSender from '/imports/reminders/action-creation/ActionCreationReminderSender';


// send reminders at 05:00
const REMINDERS_SENDING_TIME = '05:00';

SyncedCron.add({
  name: 'Send action creation reminders',

  schedule(parser) {
    return parser.text('every 15 mins');
  },

  job() {
    const timezones = getTimezones(REMINDERS_SENDING_TIME);

    Organizations.find({
      timezone: { $in: timezones },
    }, {
      fields: { _id: 1 },
    }).forEach((org) => {
      new ActionCreationReminderSender(org._id).send();
    });
  },
});
