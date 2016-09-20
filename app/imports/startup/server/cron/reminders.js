import { Organizations } from '/imports/api/organizations/organizations.js';
import ReminderSender from '/imports/core/reminders/server/ReminderSender.js';
import TZOffsets from './tz-offsets.js';


SyncedCron.add({
  name: 'Send reminders',

  schedule(parser) {
    return parser.text('every 15 mins');
  },

  job() {
    const utcTime = moment().tz('UTC').format('HH:mm');
    const offsets = TZOffsets[utcTime];

    const timezones = _(moment.tz.names()).filter((name) => {
      return _(offsets).contains(moment.tz(name).format('Z'));
    });

    Organizations.find({ timezone: { $in: timezones } }).forEach((org) => {
      new ReminderSender(org._id).send();
    });
  }
});
