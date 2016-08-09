import { Mongo } from 'meteor/mongo';

import { RisksSchema } from './risks-schema.js';
import { CollectionNames } from '../constants.js';
import ProblemsHelpers from '../problems/problems-helpers.js';


const Risks = new Mongo.Collection(CollectionNames.RISKS);
Risks.attachSchema(RisksSchema);

Risks.helpers(_.extend({}, ProblemsHelpers));

export { Risks };
