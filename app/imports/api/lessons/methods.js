import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import LessonsService from './lessons-service.js';
import { LessonsSchema, RequiredSchema } from './lessons-schema.js';
import { LessonsLearned } from './lessons.js';
import { IdSchema, DocumentIdSchema, DocumentTypeSchema } from '../schemas.js';

const organizationIdSchema = new SimpleSchema({
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
});

export const insert = new ValidatedMethod({
  name: 'Lessons.insert',

  validate: new SimpleSchema([RequiredSchema, organizationIdSchema, DocumentIdSchema, DocumentTypeSchema]).validator(),

  run({ ...args }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot create a lesson');
    }

    return LessonsService.insert({ ...args });
  }
});

export const update = new ValidatedMethod({
  name: 'Lessons.update',


  validate(doc) {
    const validationContext = new SimpleSchema([
      IdSchema,
      RequiredSchema
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

export const updateViewedBy = new ValidatedMethod({
  name: 'Lessons.updateViewedBy',

  validate: IdSchema.validator(),

  run({ _id }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a lesson'
      );
    }
    if (!LessonsLearned.findOne({ _id })) {
      throw new Meteor.Error(
        400, 'Lesson does not exist'
      );
    }

    if (!!LessonsLearned.findOne({ _id, viewedBy: this.userId })) {
      throw new Meteor.Error(
        400, 'You have been already added to this lesson'
      );
    }

    return LessonsService.updateViewedBy({ _id, userId: this.userId });
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
