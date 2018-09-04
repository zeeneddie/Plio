import { mergeDeepRight, mapObjIndexed } from 'ramda';
import faker from 'faker';
import { Mongo } from 'meteor/mongo';

import * as collections from '../../collections';
import * as services from '../../services';

export default ctx => mergeDeepRight({
  userId: faker.random.uuid(),
  collections: {
    ...mapObjIndexed((c, key) => new Mongo.Collection(key), collections),
    Users: new Mongo.Collection('users'),
  },
  services,
}, ctx);
