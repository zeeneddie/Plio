import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import RisksService from './risks-service.js';
import { RisksSchema } from './risks-schema.js';
import { Risks } from './risks.js';
import {
  IdSchema,
  OrganizationIdSchema,
  optionsSchema,
  UserIdSchema
} from '../schemas.js';

export const insert = new ValidatedMethod({
  name: 'Risks.insert',

  validate: RisksSchema.validator(),

  run({ ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create a standard'
      );
    }

    return RisksService.insert({ ...args });
  }
});

export const update = new ValidatedMethod({
  name: 'Risks.update',

  validate: new SimpleSchema([
    IdSchema, RisksSchema, optionsSchema
  ]).validator(),

  run({_id, options, query, organizationId, ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a standard'
      );
    }

    return StandardsService.update({ _id, options, query, ...args });
  }
});

export const remove = new ValidatedMethod({
  name: 'Risks.remove',

  validate: new SimpleSchema([
    IdSchema, OrganizationIdSchema
  ]).validator(),

  run({ _id, organizationId }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot delete a standard'
      );
    }
    return StandardsService.remove({ _id, deletedBy: userId});
  }
});
