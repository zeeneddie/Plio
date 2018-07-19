import { Mongo } from 'meteor/mongo';

import { CustomerSegmentSchema } from '../schemas';
import { CollectionNames } from '../constants';

const CustomerSegments = new Mongo.Collection(CollectionNames.CUSTOMER_SEGMENTS);

CustomerSegments.attachSchema(CustomerSegmentSchema);

export { CustomerSegments };
