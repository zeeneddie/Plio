import { Mongo } from 'meteor/mongo';

import { ActionSchema } from './action-schema.js';


const Actions = new Mongo.Collection('Actions');
Actions.attachSchema(ActionSchema);

export { Actions };
