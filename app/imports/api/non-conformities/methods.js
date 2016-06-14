import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import NonConformitiesService from './non-conformities-service.js';
import { NonConformitiesUpdateSchema, RequiredSchema } from './non-conformities-schema.js';
import { NonConformities } from './non-conformities.js';
import { AnalysisStatuses } from '../constants.js';
import {
  IdSchema,
  OrganizationIdSchema,
  optionsSchema,
  UserIdSchema
} from '../schemas.js';

const has = (obj, ...args) => args.some(a => obj.hasOwnProperty(a));

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

    const NC = NonConformities.findOne({ _id });

    if (!NC) {
      throw new Meteor.Error(
        403, 'Non-conformity with the given id does not exists'
      );
    }

    const isAnalysisCompleted = () => NC.analysis.status || NC.analysis.status.toString() === _.invert(AnalysisStatuses)['Completed'];

    if (has(args, 'analysis.status', 'updateOfStandards.status')) {
      if (!NC.analysis.executor && NC.analysis.executor !== this.userId) {
        throw new Meteor.Error(
          403, 'Access denied'
        );
      }
    }

    if (_.keys(args).find(key => key.includes('updateOfStandards'))) {
      if (!isAnalysisCompleted) {
        throw new Meteor.Error(
          403, 'Access denied'
        );
      }
    }

    if (has(args, 'analysis.completedAt', 'analysis.completedBy')) {
      if (!isAnalysisCompleted) {
        throw new Meteor.Error(
          403, 'Access denied'
        );
      }
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
