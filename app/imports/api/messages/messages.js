import { Mongo } from 'meteor/mongo';

import { MessagesSchema } from './messages-schema.js';


const Messages = new Mongo.Collection('Messages');
Messages.attachSchema(MessagesSchema);

export { Messages };
