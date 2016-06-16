import { Mongo } from 'meteor/mongo';

import { AnalysisSchema } from './analysis-schema.js';

const Analysis = new Mongo.Collection('Analysis');
Analysis.attachSchema(AnalysisSchema);

export { Analysis };
