import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Departments } from './departments.js';
import { DepartmentSchema } from './department-schema';
import DepartmentService from './department-service.js';
import { IdSchema, OrganizationIdSchema } from '../schemas.js';
import { chain } from '../helpers.js';
import {
  ORG_EnsureCanChange,
  ORG_EnsureCanChangeChecker,
  checkOrgMembership
} from '../checkers.js';
import Method, { CheckedMethod } from '../method';
import curry from 'lodash.curry';

const inject = fn => fn(Departments);

export const insert = new Method({
  name: 'Departments.insert',

  validate: DepartmentSchema.validator(),

  check(checker) {
    const _checker = ({ organizationId }) => {
      return chain(checkOrgMembership, ORG_EnsureCanChange)(this.userId, organizationId);
    };
    return checker(_checker);
  },

  run({ ...args }) {
    return DepartmentService.insert({ ...args });
  }
});

export const update = new CheckedMethod({
  name: 'Departments.update',

  validate: new SimpleSchema([IdSchema, DepartmentSchema]).validator(),

  check: checker => inject(checker)(ORG_EnsureCanChangeChecker),

  run(doc) {
    return DepartmentService.update(doc);
  }
});

export const remove = new CheckedMethod({
  name: 'Departments.remove',

  validate: new SimpleSchema([IdSchema, OrganizationIdSchema]).validator(),

  check: checker => inject(checker)(ORG_EnsureCanChangeChecker),

  run(doc) {
    return DepartmentService.remove(doc);
  }
});
