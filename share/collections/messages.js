import { Mongo } from 'meteor/mongo';

import { CollectionNames } from '../constants.js';
import { MessagesSchema } from '../schemas/messages-schema.js';


const Messages = new Mongo.Collection(CollectionNames.MESSAGES);
Messages.attachSchema(MessagesSchema);

export { Messages };
