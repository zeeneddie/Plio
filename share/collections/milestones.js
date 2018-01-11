import { Mongo } from 'meteor/mongo';

import { MilestonesSchema } from '../schemas';
import { CollectionNames } from '../constants';

const Milestones = new Mongo.Collection(CollectionNames.MILESTONES);

Milestones.attachSchema(MilestonesSchema);

export { Milestones };
