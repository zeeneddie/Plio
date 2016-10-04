import moment from 'moment-timezone';

import { Organizations } from '/imports/share/collections/organizations.js';
import RecapSender from '/imports/recaps/RecapSender.js';


// send recaps at 05:00
const RECAP_SENDING_HOUR = 5;

SyncedCron.add({
  name: 'Send daily recap emails',

  schedule(parser) {
    return parser.text('every 15 mins');
  },

  job() {
    const timezones = _(moment.tz.names()).filter((name) => {
      return moment().tz(name).hours() === RECAP_SENDING_HOUR;
    });

    Organizations.find({
      timezone: { $in: timezones }
    }, {
      fields: { _id: 1 }
    }).forEach((org) => {
      new RecapSender(org._id).send();
    });
  }
});
