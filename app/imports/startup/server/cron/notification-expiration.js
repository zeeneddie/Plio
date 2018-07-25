import { Notifications } from '/imports/share/collections/notifications.js';

SyncedCron.add({
  name: 'Remove expired notifications',

  schedule(parser) {
    return parser.text('every 1 day');
  },

  job() {
    // Remove notifications that are older then 1 hour
    Notifications.remove({ createdAt: { $lt: new Date(new Date().getTime() - 1000 * 60 * 60 * 1) } });

    console.log('Expired notifications removed at', new Date());
  },
});
