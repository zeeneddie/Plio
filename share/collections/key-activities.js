import { Mongo } from 'meteor/mongo';

import { KeyActivitySchema } from '../schemas';
import { CollectionNames } from '../constants';

const KeyActivities = new Mongo.Collection(CollectionNames.KEY_ACTIVITIES);

KeyActivities.attachSchema(KeyActivitySchema);

export { KeyActivities };
