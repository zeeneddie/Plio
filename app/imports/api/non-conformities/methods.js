import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import NonConformitiesService from './non-conformities-service.js';
import { NonConformitiesUpdateSchema, RequiredSchema } from './non-conformities-schema.js';
import { NonConformities } from './non-conformities.js';
import {
  IdSchema,
  OrganizationIdSchema,
  optionsSchema,
  UserIdSchema
} from '../schemas.js';

export const insert = new ValidatedMethod({
  name: 'NonConformities.insert',

  validate: RequiredSchema.validator(),

  run({ ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create a non-conformity'
      );
    }

    return NonConformitiesService.insert({ ...args });
  }
});

export const update = new ValidatedMethod({
  name: 'NonConformities.update',

  validate: new SimpleSchema([
    IdSchema, NonConformitiesUpdateSchema, OrganizationIdSchema, optionsSchema
  ]).validator(),

  run({_id, options, query, organizationId, ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a non-conformity'
      );
    }

    return NonConformitiesService.update({ _id, options, query, ...args });
  }
});

export const remove = new ValidatedMethod({
  name: 'NonConformities.remove',

  validate: new SimpleSchema([
    IdSchema, OrganizationIdSchema
  ]).validator(),

  run({ _id, organizationId }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove a non-conformity'
      );
    }
    return NonConformitiesService.remove({ _id, deletedBy: userId});
  }
});
