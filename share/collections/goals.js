import { Mongo } from 'meteor/mongo';

import { GoalsSchema } from '../schemas';
import { CollectionNames } from '../constants';


const Goals = new Mongo.Collection(CollectionNames.GOALS);

Goals.attachSchema(GoalsSchema);

export { Goals };
