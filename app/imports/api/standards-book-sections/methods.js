import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import StandardsBookSectionService from './standards-book-section-service.js';
import {
  StandardsBookSectionEditableFields,
  StandardsBookSectionSchema
} from './standards-book-section-schema.js';
import { IdSchema } from '../schemas.js';
import { checkUserId } from '../checkers.js';

export const insert = new ValidatedMethod({
  name: 'StandardsBookSections.insert',

  validate: StandardsBookSectionSchema.validator(),

  run(doc) {
    checkUserId(
      this.userId,
      'Unauthorized user cannot create a standards book section'
    );

    return StandardsBookSectionService.insert(doc);
  }
});

export const update = new ValidatedMethod({
  name: 'StandardsBookSections.update',

  validate: new SimpleSchema([
    IdSchema,
    StandardsBookSectionEditableFields
  ]).validator(),

  run(doc) {
    checkUserId(
      this.userId,
      'Unauthorized user cannot update a standards book section'
    );

    return StandardsBookSectionService.update(doc);
  }
});

export const remove = new ValidatedMethod({
  name: 'StandardsBookSections.remove',

  validate: IdSchema.validator(),

  run(doc) {
    checkUserId(
      this.userId,
      'Unauthorized user cannot remove a standards book section'
    );

    return StandardsBookSectionService.remove(doc);
  }
});
