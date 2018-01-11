import { Mongo } from 'meteor/mongo';

import { Goalschema } from '../schemas';
import { CollectionNames } from '../constants';


const Goals = new Mongo.Collection(CollectionNames.GOALS);

Goals.attachSchema(Goalschema);

export { Goals };
