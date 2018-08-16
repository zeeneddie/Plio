import { Mongo } from 'meteor/mongo';

import { CostLineSchema } from '../schemas';
import { CollectionNames } from '../constants';

const CostLines = new Mongo.Collection(CollectionNames.COST_LINES);

CostLines.attachSchema(CostLineSchema);

export { CostLines };
