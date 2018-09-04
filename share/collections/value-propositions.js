import { Mongo } from 'meteor/mongo';

import { ValuePropositionSchema } from '../schemas';
import { CollectionNames } from '../constants';

const ValuePropositions = new Mongo.Collection(CollectionNames.VALUE_PROPOSITIONS);

ValuePropositions.attachSchema(ValuePropositionSchema);

export { ValuePropositions };
