import { Mongo } from 'meteor/mongo';

import { CollectionNames } from '../constants.js';
import { RiskTypesSchema  } from '../schemas/risk-types-schema.js';


const RiskTypes = new Mongo.Collection(CollectionNames.RISK_TYPES);
RiskTypes.attachSchema(RiskTypesSchema);

export { RiskTypes };
