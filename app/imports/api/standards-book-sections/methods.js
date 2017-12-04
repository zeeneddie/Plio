import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import StandardsBookSectionService from './standards-book-section-service';
import {
  StandardsBookSectionSchema,
} from '/imports/share/schemas/standards-book-section-schema';
import { StandardsBookSections } from '/imports/share/collections/standards-book-sections';
import { IdSchema, OrganizationIdSchema } from '/imports/share/schemas/schemas';
import Method, { CheckedMethod } from '../method';
import { inject } from '/imports/api/helpers';
import {
  ORG_EnsureCanChangeChecker,
  ORG_EnsureCanChangeCheckerCurried,
} from '../checkers';

const injectSBS = inject(StandardsBookSections);

export const insert = new Method({
  name: 'StandardsBookSections.insert',

  validate: StandardsBookSectionSchema.validator(),

  check(checker) {
    return checker(ORG_EnsureCanChangeCheckerCurried(this.userId));
  },

  run(doc) {
    return StandardsBookSectionService.insert(doc);
  },
});

export const update = new CheckedMethod({
  name: 'StandardsBookSections.update',

  validate: new SimpleSchema([
    IdSchema,
    StandardsBookSectionSchema,
  ]).validator(),

  check: checker => injectSBS(checker)(ORG_EnsureCanChangeChecker),

  run(doc) {
    return StandardsBookSectionService.update(doc);
  },
});

export const remove = new CheckedMethod({
  name: 'StandardsBookSections.remove',

  validate: new SimpleSchema([IdSchema, OrganizationIdSchema]).validator(),

  check: checker => injectSBS(checker)(ORG_EnsureCanChangeChecker),

  run(doc) {
    return StandardsBookSectionService.remove(doc);
  },
});
