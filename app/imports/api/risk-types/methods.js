import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import RiskTypesService from './risk-types-service.js';
import { RiskTypesSchema, EditableFields } from '/imports/share/schemas/risk-types-schema.js';
import { RiskTypes } from '/imports/share/collections/risk-types.js';
import { IdSchema } from '/imports/share/schemas/schemas.js';
import Method, { CheckedMethod } from '../method.js';
import { inject } from '/imports/api/helpers.js';
import {
  ORG_EnsureCanChangeChecker,
  ORG_EnsureCanChangeCheckerCurried
} from '../checkers.js';

const injectRT = inject(RiskTypes);

export const insert = new Method({
  name: 'RiskTypes.insert',

  validate: RiskTypesSchema.validator(),

  check(checker) {
    return checker(
      ORG_EnsureCanChangeCheckerCurried(this.userId)
    );
  },

  run({ ...args }) {
    return RiskTypesService.insert({ ...args });
  },
});

export const update = new CheckedMethod({
  name: 'RiskTypes.update',

  validate: new SimpleSchema([IdSchema, EditableFields]).validator(),

  check: checker => injectRT(checker)(ORG_EnsureCanChangeChecker),

  run({ ...args }) {
    return RiskTypesService.update({ ...args });
  },
});

export const remove = new CheckedMethod({
  name: 'RiskTypes.remove',

  validate: IdSchema.validator(),

  check: checker => injectRT(checker)(ORG_EnsureCanChangeChecker),

  run({ _id }) {
    return RiskTypesService.remove({ _id });
  },
});
