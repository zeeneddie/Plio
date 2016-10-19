import { Organizations } from '/imports/share/collections/organizations.js';
import { getTimezones } from './helpers';
import WorkflowUpdater from '/imports/workflow/WorkflowUpdater.js';


SyncedCron.add({
  name: 'Update workflow statuses',

  schedule(parser) {
    return parser.text('every 15 mins');
  },

  job() {
    const timezones = getTimezones('00:00');

    Organizations.find({
      timezone: { $in: timezones }
    }, {
      fields: { _id: 1 }
    }).forEach((org) => {
      new WorkflowUpdater(org._id).update();
    });
  }
});
