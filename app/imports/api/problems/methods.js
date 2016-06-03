import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import ProblemsService from './problems-service.js';
import { ProblemsSchema, requiredFields } from './problems-schema.js';
import { Problems } from './problems.js';
import {
  IdSchema,
  OrganizationIdSchema,
  optionsSchema,
  UserIdSchema
} from '../schemas.js';

export const insert = new ValidatedMethod({
  name: 'Problems.insert',

  validate: requiredFields.validator(),

  run({ ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create a problem'
      );
    }

    return ProblemsService.insert({ ...args });
  }
});

export const update = new ValidatedMethod({
  name: 'Problems.update',

  validate: new SimpleSchema([
    IdSchema, ProblemsSchema, optionsSchema
  ]).validator(),

  run({_id, options, query, organizationId, ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a problem'
      );
    }

    return ProblemsService.update({ _id, options, query, ...args });
  }
});

export const remove = new ValidatedMethod({
  name: 'Problems.remove',

  validate: new SimpleSchema([
    IdSchema, OrganizationIdSchema
  ]).validator(),

  run({ _id, organizationId }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot delete a problem'
      );
    }
    return ProblemsService.remove({ _id, deletedBy: userId});
  }
});
