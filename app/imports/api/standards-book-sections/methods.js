import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import curry from 'lodash.curry';

import StandardsBookSectionService from './standards-book-section-service.js';
import {
  StandardsBookSectionSchema
} from './standards-book-section-schema.js';
import { StandardsBookSections } from './standards-book-sections.js';
import { IdSchema, OrganizationIdSchema } from '../schemas.js';
import Method, { CheckedMethod } from '../method.js';
import { inject, withUserId } from '../helpers.js';
import { exists, ORG_EnsureCanChangeChecker } from '../checkers.js';

const injectSBS = inject(StandardsBookSections);

const ensureCanChangeOrgSettings = withUserId(curry(ORG_EnsureCanChangeChecker));

export const insert = new Method({
  name: 'StandardsBookSections.insert',

  validate: StandardsBookSectionSchema.validator(),

  check(checker) {
    return checker(
      ensureCanChangeOrgSettings(this.userId)
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
