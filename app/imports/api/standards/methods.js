import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import StandardsService from './standards-service.js';
import { StandardsSchema, StandardsUpdateSchema } from './standards-schema.js';
import { Standards } from './standards.js';
import { IdSchema } from '../schemas.js';
import { optionsSchema } from '../schemas.js';
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
    const canCreateStandards = Roles.userIsInRole(this.userId, UserRoles.CREATE_STANDARDS_DOCUMENTS, organizationId);

    if (!canCreateStandards) {
      throw new Meteor.Error(
        403,
        'User is not authorized for creating standards'
      );
    }

    return StandardsService.insert(...args);
  }
});

export const update = new ValidatedMethod({
  name: 'Standards.update',

  validate: new SimpleSchema([
    IdSchema, StandardsUpdateSchema, optionsSchema
  ]).validator(),

  run({_id, options, ...args}) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a standard'
      );
    }

    return StandardsService.update({ _id, options, ...args });
  }
});

export const remove = new ValidatedMethod({
  name: 'Standards.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot delete a standard'
      );
    }

    return StandardsService.remove({ _id });
  }
});
