import { Mongo } from 'meteor/mongo';

import { ProblemsSchema } from './problems-schema.js';

const Problems = new Mongo.Collection('Problems');
Problems.attachSchema(ProblemsSchema);

export { Problems };
