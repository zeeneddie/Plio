import { Mongo } from 'meteor/mongo';

import { CollectionNames } from '../constants.js';
import { NotificationsSchema } from '../schemas/notifications-schema.js';


const Notifications = new Mongo.Collection(CollectionNames.NOTIFICATIONS);
Notifications.attachSchema(NotificationsSchema);

export { Notifications };
