import moment from 'moment-timezone';

import WorkflowUpdater from '/imports/workflow/WorkflowUpdater.js';


SyncedCron.add({
  name: 'Update workflow statuses',

  schedule(parser) {
    return parser.text('every 15 mins');
  },

  job() {
    const timezones = _(moment.tz.names()).filter((name) => {
      return moment().tz(name).hours() === 0;
    });

    Organizations.find({
      timezone: { $in: timezones }
    }, {
      fields: { _id: 1 }
    }).forEach((org) => {
      new WorkflowUpdater(org._id).update();
    });
  }
});
