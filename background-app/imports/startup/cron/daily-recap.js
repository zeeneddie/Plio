import { Organizations } from '/imports/share/collections/organizations.js';
import { getTimezones } from './helpers';
import RecapSender from '/imports/recaps/RecapSender.js';


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
      timezone: { $in: timezones }
    }, {
      fields: { _id: 1 }
    }).forEach((org) => {
      new RecapSender(org._id).send();
    });
  }
});
