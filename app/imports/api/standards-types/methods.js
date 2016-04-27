import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import StandardsTypeService from './standards-type-service.js';
import { StandardsTypeSchema } from './standards-type-schema.js';
import { IdSchema } from '../schemas.js';
import { checkUserId } from '../checkers.js';

export const insert = new ValidatedMethod({
  name: 'StandardsTypes.insert',

  validate: StandardsTypeSchema.validator(),

  run(doc) {
    checkUserId(
      this.userId, 'Unauthorized user cannot create a standard type'
    );

    return StandardsTypeService.insert(doc);
  }
});

export const update = new ValidatedMethod({
  name: 'StandardsTypes.update',

  validate: new SimpleSchema([IdSchema, {
    name: { type: String },
    abbreviation: { type: String }
  }]).validator(),

  run(doc) {
    checkUserId(
      this.userId, 'Unauthorized user cannot update a standard type'
    );

    return StandardsTypeService.update(doc);
  }
});

export const remove = new ValidatedMethod({
  name: 'StandardsTypes.remove',

  validate: IdSchema.validator(),

  run(doc) {
    checkUserId(
      this.userId, 'Unauthorized user cannot remove a standard type'
    );

    return StandardsTypeService.remove(doc);
  }
});
