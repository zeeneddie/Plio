import { Mongo } from 'meteor/mongo';

import { NonConformitiesSchema } from './non-conformities-schema.js';
import { CollectionNames } from '../constants.js';
import ProblemsHelpers from '../problems/problems-helpers.js';


const NonConformities = new Mongo.Collection(CollectionNames.NCS);
NonConformities.attachSchema(NonConformitiesSchema);

NonConformities.helpers(_.extend({}, ProblemsHelpers));

export { NonConformities };
