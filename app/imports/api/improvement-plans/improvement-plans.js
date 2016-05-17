import { Mongo } from 'meteor/mongo';

import { ImprovementPlansSchema } from './improvement-plans-schema.js';

const ImprovementPlans = new Mongo.Collection('ImprovementPlans');
ImprovementPlans.attachSchema(ImprovementPlansSchema);

export { ImprovementPlans };
