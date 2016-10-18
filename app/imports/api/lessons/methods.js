import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import LessonsService from './lessons-service.js';
import { LessonsSchema, RequiredSchema } from '/imports/share/schemas/lessons-schema.js';
import { LessonsLearned } from '/imports/share/collections/lessons.js';
import { IdSchema, DocumentIdSchema, DocumentTypeSchema } from '/imports/share/schemas/schemas.js';
import Method, { CheckedMethod } from '../method.js';

const organizationIdSchema = new SimpleSchema({
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
});

const inject = fn => fn(LessonsLearned);

export const insert = new Method({
  name: 'Lessons.insert',

  validate: new SimpleSchema([RequiredSchema, organizationIdSchema, DocumentIdSchema, DocumentTypeSchema]).validator(),

  run({ ...args }) {
    return LessonsService.insert({ ...args });
  }
});

export const update = new CheckedMethod({
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

  check: checker => inject(checker),

  run({ _id, ...args }) {
    return LessonsService.update({ _id, ...args });
  }
});

export const updateViewedBy = new CheckedMethod({
  name: 'Lessons.updateViewedBy',

  validate: IdSchema.validator(),

  check: checker => inject(checker),

  run({ _id }) {
    return LessonsService.updateViewedBy({ _id, userId: this.userId });
  }
});

export const remove = new CheckedMethod({
  name: 'Lessons.remove',

  validate: IdSchema.validator(),

  check: checker => inject(checker),

  run({ _id }) {
    return LessonsService.remove({ _id });
  }
});
