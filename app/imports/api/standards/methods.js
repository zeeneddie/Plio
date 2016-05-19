import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import StandardsService from './standards-service.js';
import { StandardsSchema, StandardsUpdateSchema } from './standards-schema.js';
import { Standards } from './standards.js';
import { IdSchema, OrganizationIdSchema, optionsSchema } from '../schemas.js';
import { UserRoles } from '../constants';

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
    const canCreateStandards = Roles.userIsInRole(this.userId, UserRoles.CREATE_UPDATE_DELETE_STANDARDS, organizationId);

    if (!canCreateStandards) {
      throw new Meteor.Error(
        403,
        'You are not authorized for creating, removing or editing standards'
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

    const canEditStandards = Roles.userIsInRole(this.userId, UserRoles.CREATE_UPDATE_DELETE_STANDARDS, organizationId);

    if (!canEditStandards) {
      throw new Meteor.Error(
        403,
        'You are not authorized for creating, removing or editing standards'
      );
    }

    return StandardsService.update({ _id, options, ...args });
  }
});

export const updateViewedBy = new ValidatedMethod({
  name: 'Standards.updateViewedBy',

  validate: IdSchema.validator(),

  run({ _id }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot delete a standard'
      );
    }

    if (!!Standards.findOne({ _id, viewedBy: this.userId })) {
      throw new Meteor.Error(
        403,
        'You have been already added to this list'
      );
    }

    return StandardsService.updateViewedBy({ _id, userId: this.userId });
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

    const canDeleteStandards = Roles.userIsInRole(this.userId, UserRoles.CREATE_UPDATE_DELETE_STANDARDS, organizationId);

    if (!canDeleteStandards) {
      throw new Meteor.Error(
        403,
        'You are not authorized for creating, removing or editing standards'
      );
    }

    return StandardsService.remove({ _id });
  }
});
