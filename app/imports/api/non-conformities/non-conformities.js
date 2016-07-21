import { Mongo } from 'meteor/mongo';

import { NonConformitiesSchema } from './non-conformities-schema.js';
import ProblemsHelpers from '../problems/problems-helpers.js';


const NonConformities = new Mongo.Collection('NonConformities');
NonConformities.attachSchema(NonConformitiesSchema);

NonConformities.helpers(_.extend({}, ProblemsHelpers));

export { NonConformities };
