import { Mongo } from 'meteor/mongo';

import { KeyPartnerSchema } from '../schemas';
import { CollectionNames } from '../constants';

const KeyPartners = new Mongo.Collection(CollectionNames.KEY_PARTNERS);

KeyPartners.attachSchema(KeyPartnerSchema);

export { KeyPartners };
