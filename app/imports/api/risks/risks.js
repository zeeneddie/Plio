import { Mongo } from 'meteor/mongo';

import { RisksSchema } from './risks-schema.js';

const Risks = new Mongo.Collection('RiskRegister');
Risks.attachSchema(RisksSchema);

export { Risks };
