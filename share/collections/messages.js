import { Mongo } from 'meteor/mongo';

import { MessagesSchema } from '../schemas/messages-schema.js';


const Messages = new Mongo.Collection('Messages');
Messages.attachSchema(MessagesSchema);

export { Messages };
