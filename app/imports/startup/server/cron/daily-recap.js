import moment from 'moment-timezone';

import { Organizations } from '/imports/api/organizations/organizations.js';
import RecapSender from '/imports/core/audit/server/RecapSender.js';
import TZOffsets from './tz-offsets.js';


SyncedCron.add({
  name: 'Send daily recap emails',

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
      new RecapSender(org._id).send();
    });
  }
});
