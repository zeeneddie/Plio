import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidationError } from 'meteor/mdg:validation-error';

import LessonsService from './lessons-service';
import { RequiredSchema } from '/imports/share/schemas/lessons-schema';
import { LessonsLearned } from '/imports/share/collections/lessons';
import {
  IdSchema,
  DocumentIdSchema,
  DocumentTypeSchema,
  OrganizationIdSchema,
} from '/imports/share/schemas/schemas';
import Method, { CheckedMethod } from '../method';
import { inject, always, T } from '../helpers';
import { checkDocAndMembership } from '../checkers';
import { getCollectionByDocType } from '/imports/share/helpers';

// TODO: check all fields for all documents (almost) with userId for org membership
const injectLSN = inject(LessonsLearned);

export const insert = new Method({
  name: 'Lessons.insert',

  validate: new SimpleSchema([
    RequiredSchema,
    OrganizationIdSchema,
    DocumentIdSchema,
    DocumentTypeSchema,
  ]).validator(),

  check(checker) {
    return checker(({ documentId, documentType }) => checkDocAndMembership(
      getCollectionByDocType(documentType),
      documentId,
      this.userId,
    ));
  },

  run({ ...args }) {
    return LessonsService.insert({ ...args });
  },
});


export const update = new CheckedMethod({
  name: 'Lessons.update',

  validate(doc) {
    const validationContext = new SimpleSchema([
      IdSchema,
      RequiredSchema,
    ]).newContext();

    for (const key in doc) {
      if (!validationContext.validateOne(doc, key)) {
        const errors = validationContext.invalidKeys();
        const message = validationContext.keyErrorMessage(errors[0].name);
        throw new ValidationError(errors, message);
      }
    }
  },

  check: checker => injectLSN(checker)(always(T)),

  run({ _id, ...args }) {
    return LessonsService.update({ _id, ...args });
  },
});

export const updateViewedBy = new CheckedMethod({
  name: 'Lessons.updateViewedBy',

  validate: IdSchema.validator(),

  check: checker => injectLSN(checker)(always(T)),

  run({ _id }) {
    return LessonsService.updateViewedBy({ _id, userId: this.userId });
  },
});

export const remove = new CheckedMethod({
  name: 'Lessons.remove',

  validate: IdSchema.validator(),

  check: checker => injectLSN(checker)(always(T)),

  run({ _id }) {
    return LessonsService.remove({ _id });
  },
});
