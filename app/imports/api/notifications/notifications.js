import { Mongo } from 'meteor/mongo';

import { NotificationsSchema } from './notifications-schema.js';

const Notifications = new Mongo.Collection('Notifications');
Notifications.attachSchema(NotificationsSchema);

export { Notifications };
