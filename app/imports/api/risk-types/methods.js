import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import curry from 'lodash.curry';

import RiskTypesService from './risk-types-service.js';
import { RiskTypesSchema, EditableFields } from './risk-types-schema.js';
import { RiskTypes } from './risk-types.js';
import { IdSchema, OrganizationIdSchema } from '../schemas.js';
import { UserRoles } from '../constants';
import Method, { CheckedMethod } from '../method.js';
import { withUserId, inject } from '../helpers.js';
import { exists, ORG_EnsureCanChangeChecker } from '../checkers.js';

const ensureCanChangeOrgSettings = withUserId(curry(ORG_EnsureCanChangeChecker));

const injectRT = inject(RiskTypes);

export const insert = new Method({
  name: 'RiskTypes.insert',

  validate: RiskTypesSchema.validator(),

  check(checker) {
    return checker(
      ensureCanChangeOrgSettings(this.userId)
    );
  },

  run({ ...args }) {
    return RiskTypesService.insert({ ...args });
  }
});

export const update = new CheckedMethod({
  name: 'RiskTypes.update',

  validate: new SimpleSchema([IdSchema, EditableFields]).validator(),

  check: checker => injectRT(checker)(ORG_EnsureCanChangeChecker),

  run({ ...args }) {
    return RiskTypesService.update({ ...args });
  }
});

export const remove = new CheckedMethod({
  name: 'RiskTypes.remove',

  validate: IdSchema.validator(),

  check: checker => injectRT(checker)(ORG_EnsureCanChangeChecker),

  run({ _id }) {
    return RiskTypesService.remove({ _id });
  }
});
