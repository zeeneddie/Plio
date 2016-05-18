import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { DepartmentSchema } from './department-schema';
import DepartmentService from './department-service.js';
import { IdSchema, OrganizationIdSchema } from '../schemas.js';
import { UserRoles } from '../constants';


export const insert = new ValidatedMethod({
  name: 'Departments.insert',

  validate: DepartmentSchema.validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create a department'
      );
    }
    
    const { organizationId } = doc;
    const canEditOrgSettings = Roles.userIsInRole(this.userId, UserRoles.CHANGE_ORG_SETTINGS, organizationId);

    if (!canEditOrgSettings) {
      throw new Meteor.Error(
        403,
        'User is not authorized for editing organization settings'
      );
    }

    return DepartmentService.insert(doc);
  }
});

export const update = new ValidatedMethod({
  name: 'Departments.update',

  validate: new SimpleSchema([IdSchema, DepartmentSchema]).validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a department'
      );
    }

    const { organizationId } = doc;
    const canEditOrgSettings = Roles.userIsInRole(this.userId, UserRoles.CHANGE_ORG_SETTINGS, organizationId);

    if (!canEditOrgSettings) {
      throw new Meteor.Error(
        403,
        'User is not authorized for editing organization settings'
      );
    }

    return DepartmentService.update(doc);
  }
});

export const remove = new ValidatedMethod({
  name: 'Departments.remove',

  validate: new SimpleSchema([IdSchema, OrganizationIdSchema]).validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove a department'
      );
    }

    const { organizationId } = doc;
    const canEditOrgSettings = Roles.userIsInRole(this.userId, UserRoles.CHANGE_ORG_SETTINGS, organizationId);

    if (!canEditOrgSettings) {
      throw new Meteor.Error(
        403,
        'User is not authorized for editing organization settings'
      );
    }

    return DepartmentService.remove(doc);
  }
});
