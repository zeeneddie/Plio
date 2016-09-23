import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import StandardsTypeService from './standard-types-service.js';
import { StandardsTypeSchema } from '/imports/share/schemas/standard-types-schema.js';
import { StandardTypes } from '/imports/share/collections/standard-types.js';
import { IdSchema, OrganizationIdSchema } from '/imports/share/schemas/schemas.js';
import Method, { CheckedMethod } from '../method.js';
import { inject } from '/imports/share/helpers.js';
import {
  ORG_EnsureCanChangeChecker,
  ORG_EnsureCanChangeCheckerCurried
} from '../checkers.js';

const injectST = inject(StandardTypes);

export const insert = new Method({
  name: 'StandardTypes.insert',

  validate: StandardsTypeSchema.validator(),

  check(checker) {
    return checker(
      ORG_EnsureCanChangeCheckerCurried(this.userId)
    );
  },

  run(doc) {
    return StandardsTypeService.insert(doc);
  }
});

export const update = new CheckedMethod({
  name: 'StandardTypes.update',

  validate: new SimpleSchema([IdSchema, StandardsTypeSchema]).validator(),

  check: checker => injectST(checker)(ORG_EnsureCanChangeChecker),

  run(doc) {
    return StandardsTypeService.update(doc);
  }
});

export const remove = new CheckedMethod({
  name: 'StandardTypes.remove',

  validate: new SimpleSchema([IdSchema, OrganizationIdSchema]).validator(),

  check: checker => injectST(checker)(ORG_EnsureCanChangeChecker),

  run(doc) {
    return StandardsTypeService.remove(doc);
  }
});
