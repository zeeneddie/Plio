import { Mongo } from 'meteor/mongo';

import { ChannelSchema } from '../schemas';
import { CollectionNames } from '../constants';

const Channels = new Mongo.Collection(CollectionNames.CHANNELS);

Channels.attachSchema(ChannelSchema);

export { Channels };
