import { Mongo } from 'meteor/mongo';

import { RisksSectionSchema  } from './risks-section-schema.js';

const RisksSections = new Mongo.Collection('RisksSections');
RisksSections.attachSchema(RisksSectionSchema);

export { RisksSections };
