import { Mongo } from 'meteor/mongo';

import { CustomerRelationshipSchema } from '../schemas';
import { CollectionNames } from '../constants';

const CustomerRelationships = new Mongo.Collection(CollectionNames.CUSTOMER_RELATIONSHIPS);

CustomerRelationships.attachSchema(CustomerRelationshipSchema);

export { CustomerRelationships };
