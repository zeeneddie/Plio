import { Mongo } from 'meteor/mongo';

import { RevenueStreamSchema } from '../schemas';
import { CollectionNames } from '../constants';

const RevenueStreams = new Mongo.Collection(CollectionNames.REVENUE_STREAMS);

RevenueStreams.attachSchema(RevenueStreamSchema);

export { RevenueStreams };
