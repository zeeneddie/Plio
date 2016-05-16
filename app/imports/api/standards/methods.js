import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import StandardsService from './standards-service.js';
import { StandardsSchema, StandardsUpdateSchema } from './standards-schema.js';
import { Standards } from './standards.js';
import { IdSchema, OrganizationIdSchema } from '../schemas.js';
import { UserRoles } from '../constants';

const optionsSchema = new SimpleSchema({
  options: {
    type: Object,
    optional: true,
    blackbox: true
  },
  query: {
    type: Object,
    optional: true,
    blackbox: true
  }
});

export const insert = new ValidatedMethod({
  name: 'Standards.insert',

  validate: StandardsSchema.validator(),

  run(...args) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create a standard'
      );
    }
    
    const [ doc ] = args;
    const { organizationId } = doc;
    const canCreateStandards = Roles.userIsInRole(this.userId, UserRoles.CREATE_STANDARDS_DOCUMENTS, organizationId);

    if (!canCreateStandards) {
      throw new Meteor.Error(
        403,
        'User is not authorized for creating, removing or editing standards'
      );
    }

    return StandardsService.insert(...args);
  }
});

export const update = new ValidatedMethod({
  name: 'Standards.update',

  validate: new SimpleSchema([
    IdSchema, StandardsUpdateSchema, optionsSchema, OrganizationIdSchema
  ]).validator(),

  run({_id, options, ...args, organizationId }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a standard'
      );
    }

    const canEditStandards = Roles.userIsInRole(this.userId, UserRoles.CREATE_STANDARDS_DOCUMENTS, organizationId);

    if (!canEditStandards) {
      throw new Meteor.Error(
        403,
        'User is not authorized for creating, removing or editing standards'
      );
    }

    return StandardsService.update({ _id, options, ...args });
  }
});

export const remove = new ValidatedMethod({
  name: 'Standards.remove',
  
  validate: new SimpleSchema([
    IdSchema, OrganizationIdSchema
  ]).validator(),

  run({ _id, organizationId }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot delete a standard'
      );
    }

    const canDeleteStandards = Roles.userIsInRole(this.userId, UserRoles.CREATE_STANDARDS_DOCUMENTS, organizationId);

    if (!canDeleteStandards) {
      throw new Meteor.Error(
        403,
        'User is not authorized for creating, removing or editing standards'
      );
    }

    return StandardsService.remove({ _id });
  }
});
