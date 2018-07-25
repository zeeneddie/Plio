import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Departments } from '/imports/share/collections/departments';
import { DepartmentSchema } from '/imports/share/schemas/department-schema';
import { IdSchema, OrganizationIdSchema } from '/imports/share/schemas/schemas';
import { chain, inject } from '/imports/api/helpers';
import { DepartmentService } from '../../share/services';
import {
  ORG_EnsureCanChange,
  ORG_EnsureCanChangeChecker,
  checkOrgMembership,
} from '../checkers';
import Method, { CheckedMethod } from '../method';

const injectDEP = inject(Departments);

export const insert = new Method({
  name: 'Departments.insert',

  validate: DepartmentSchema.validator(),

  check(checker) {
    const _checker = ({ organizationId }) => chain(
      checkOrgMembership,
      ORG_EnsureCanChange,
    )(this.userId, organizationId);
    return checker(_checker);
  },

  run({ ...args }) {
    return DepartmentService.insert({ ...args });
  },
});

export const update = new CheckedMethod({
  name: 'Departments.update',

  validate: new SimpleSchema([IdSchema, DepartmentSchema]).validator(),

  check: checker => injectDEP(checker)(ORG_EnsureCanChangeChecker),

  run(doc) {
    return DepartmentService.update(doc);
  },
});

export const remove = new CheckedMethod({
  name: 'Departments.remove',

  validate: new SimpleSchema([IdSchema, OrganizationIdSchema]).validator(),

  check: checker => injectDEP(checker)(ORG_EnsureCanChangeChecker),

  run(doc) {
    return DepartmentService.remove(doc);
  },
});
