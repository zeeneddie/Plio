import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import LessonsService from './lessons-service.js';
import { LessonsSchema, requiredSchema } from './lessons-schema.js';
import { Lessons } from './lessons.js';
import { IdSchema } from '../schemas.js';

const organizationIdSchema = new SimpleSchema({
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
});

export const insert = new ValidatedMethod({
  name: 'Lessons.insert',

  validate: new SimpleSchema([requiredSchema, organizationIdSchema]).validator(),

  run(...args) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot create a lesson');
    }

    return LessonsService.insert(...args);
  }
});

export const update = new ValidatedMethod({
  name: 'Lessons.update',

  validate(doc) {
    const validationContext = new SimpleSchema([
      IdSchema,
      requiredSchema
    ]).newContext();

    for (let key in doc) {
      if (!validationContext.validateOne(doc, key)) {
        const errors = validationContext.invalidKeys();
        const message = validationContext.keyErrorMessage(errors[0].name);
        throw new ValidationError(errors, message);
      }
    }
  },

  run({ _id, ...args }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot update a lesson');
    }

    return LessonsService.update({ _id, ...args });
  }
});

export const remove = new ValidatedMethod({
  name: 'Lessons.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot remove a lesson');
    }

    return LessonsService.remove({ _id });
  }
});
