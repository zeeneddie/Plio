import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Departments } from './departments.js';
import { DepartmentSchema } from './department-schema';
import DepartmentService from './department-service.js';
import { IdSchema, OrganizationIdSchema } from '../schemas.js';
import { chain } from '../helpers.js';
import {
  O_EnsureCanChange,
  O_EnsureCanChangeChecker,
  checkOrgMembership
} from '../checkers.js';
import Method, { CheckedMethod } from '../method';

const inject = fn => fn(Departments);

export const insert = new Method({
  name: 'Departments.insert',

  validate: DepartmentSchema.validator(),

  run({ organizationId, ...args }) {
    chain(checkOrgMembership, O_EnsureCanChange)(this.userId, organizationId);

    return DepartmentService.insert({ organizationId, ...args });
  }
});

export const update = new CheckedMethod({
  name: 'Departments.update',

  validate: new SimpleSchema([IdSchema, DepartmentSchema]).validator(),

  check: checker => inject(checker)(O_EnsureCanChangeChecker),

  run(doc) {
    return DepartmentService.update(doc);
  }
});

export const remove = new ValidatedMethod({
  name: 'Departments.remove',

  validate: new SimpleSchema([IdSchema, OrganizationIdSchema]).validator(),

  check: checker => inject(checker)(O_EnsureCanChangeChecker),

  run(doc) {
    return DepartmentService.remove(doc);
  }
});
