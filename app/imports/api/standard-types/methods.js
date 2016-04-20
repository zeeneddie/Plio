import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import StandardTypeService from './standard-type-service.js';


export const insert = new ValidatedMethod({
  name: 'StandardTypes.insert',

  validate: new SimpleSchema({
    name: { type: String },
    abbreviation: { type: String },
    organizationId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),

  run(doc) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create a standard type'
      );
    }

    return StandardTypeService.insert(doc);
  }
});

export const update = new ValidatedMethod({
  name: 'StandardTypes.update',

  validate: new SimpleSchema({
    _id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    name: { type: String },
    abbreviation: { type: String }
  }).validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a standard type'
      );
    }

    return StandardTypeService.update(doc);
  }
});

export const remove = new ValidatedMethod({
  name: 'StandardTypes.remove',

  validate: new SimpleSchema({
    _id: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove a standard type'
      );
    }

    return StandardTypeService.remove(doc);
  }
});
