import { Mongo } from 'meteor/mongo';

import { RiskTypesSchema  } from './risk-types-schema.js';

const RiskTypes = new Mongo.Collection('RiskTypes');
RiskTypes.attachSchema(RiskTypesSchema);

export { RiskTypes };
