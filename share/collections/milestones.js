import { Mongo } from 'meteor/mongo';

import { MilestoneSchema } from '../schemas';
import { CollectionNames } from '../constants';

const Milestones = new Mongo.Collection(CollectionNames.MILESTONES);

Milestones.attachSchema(MilestoneSchema);

export { Milestones };
