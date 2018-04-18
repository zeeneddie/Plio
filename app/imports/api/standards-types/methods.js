/* eslint-disable camelcase */

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { when } from 'ramda';

import StandardsTypeService from './standards-type-service';
import { StandardsTypeSchema } from '../../share/schemas/standards-type-schema';
import { StandardTypes } from '../../share/collections';
import { IdSchema, OrganizationIdSchema } from '../../share/schemas/schemas';
import Errors from '../../share/errors';
import Method, { CheckedMethod } from '../method';
import { inject } from '../helpers';
import {
  ORG_EnsureCanChangeChecker,
  ORG_EnsureCanChangeCheckerCurried,
} from '../checkers';
import { isStandardOperatingProcedure } from './helpers';

const injectST = inject(StandardTypes);

const ensureCanChange = when(isStandardOperatingProcedure, () => {
  throw new Meteor.Error(Errors.ST_CANNOT_CHANGE_DEFAULT);
});

export const insert = new Method({
  name: 'StandardTypes.insert',

  validate: StandardsTypeSchema.validator(),

  check(checker) {
    return checker(ORG_EnsureCanChangeCheckerCurried(this.userId));
  },

  run(doc) {
    return StandardsTypeService.insert(doc);
  },
});

export const update = new CheckedMethod({
  name: 'StandardTypes.update',

  validate: new SimpleSchema([IdSchema, StandardsTypeSchema]).validator(),

  check: checker => injectST(checker)(ORG_EnsureCanChangeChecker),

  run(args, doc) {
    ensureCanChange(doc);

    return StandardsTypeService.update(args);
  },
});

export const remove = new CheckedMethod({
  name: 'StandardTypes.remove',

  validate: new SimpleSchema([IdSchema, OrganizationIdSchema]).validator(),

  check: checker => injectST(checker)(ORG_EnsureCanChangeChecker),

  run(args, doc) {
    ensureCanChange(doc);

    return StandardsTypeService.remove(args);
  },
});
