import { Mongo } from 'meteor/mongo';

import { CollectionNames } from '../constants';
import { PotentialGainsSchema } from '../schemas/potential-gains-schema';

const PotentialGains = new Mongo.Collection(CollectionNames.POTENTIAL_GAINS);
PotentialGains.attachSchema(PotentialGainsSchema);

export { PotentialGains };
