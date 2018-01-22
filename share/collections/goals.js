import { Mongo } from 'meteor/mongo';

import { GoalSchema } from '../schemas';
import { CollectionNames } from '../constants';


const Goals = new Mongo.Collection(CollectionNames.GOALS);

Goals.attachSchema(GoalSchema);

export { Goals };
