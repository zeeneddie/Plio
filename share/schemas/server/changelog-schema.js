import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { CollectionNames, DocChangesKinds } from '../../constants.js';


export const ChangelogSchema = new SimpleSchema({
  collection: {
    type: String,
    allowedValues: _(CollectionNames).values(),
  },
  changeKind: {
    type: Number,
    allowedValues: _(DocChangesKinds).values(),
  },
  newDocument: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  oldDocument: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
});
