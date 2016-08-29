import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import StandardsBookSectionService from './standards-book-section-service.js';
import {
  StandardsBookSectionSchema
} from './standards-book-section-schema.js';
import { StandardsBookSections } from './standards-book-sections.js';
import { IdSchema, OrganizationIdSchema } from '../schemas.js';
import Method, { CheckedMethod } from '../method.js';
import { inject } from '../helpers.js';
import {
  ORG_EnsureCanChangeChecker,
  ORG_EnsureCanChangeCheckerCurried
} from '../checkers.js';

const injectSBS = inject(StandardsBookSections);

export const insert = new Method({
  name: 'StandardsBookSections.insert',

  validate: StandardsBookSectionSchema.validator(),

  check(checker) {
    return checker(
      ORG_EnsureCanChangeCheckerCurried(this.userId)
    );
  },

  run(doc) {
    return StandardsBookSectionService.insert(doc);
  }
});

export const update = new CheckedMethod({
  name: 'StandardsBookSections.update',

  validate: new SimpleSchema([
    IdSchema,
    StandardsBookSectionSchema
  ]).validator(),

  check: checker => injectSBS(checker)(ORG_EnsureCanChangeChecker),

  run(doc) {
    return StandardsBookSectionService.update(doc);
  }
});

export const remove = new CheckedMethod({
  name: 'StandardsBookSections.remove',

  validate: new SimpleSchema([IdSchema, OrganizationIdSchema]).validator(),

  check: checker => injectSBS(checker)(ORG_EnsureCanChangeChecker),

  run(doc) {
    return StandardsBookSectionService.remove(doc);
  }
});
