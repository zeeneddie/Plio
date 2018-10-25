import { Mongo } from 'meteor/mongo';

import { GuidanceSchema } from '../schemas';
import { CollectionNames } from '../constants';

const Guidances = new Mongo.Collection(CollectionNames.GUIDANCES);

Guidances.attachSchema(GuidanceSchema);

export { Guidances };
