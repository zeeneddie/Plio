import { Mongo } from 'meteor/mongo';

import { ProblemsSectionSchema  } from './problems-section-schema.js';

const ProblemsSections = new Mongo.Collection('ProblemsSections');
ProblemsSections.attachSchema(ProblemsSectionSchema);

export { ProblemsSections };
