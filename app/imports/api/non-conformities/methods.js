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

import { checkAnalysis } from '../checkers.js';

export const insert = new ValidatedMethod({
  name: 'NonConformities.insert',

  validate: new SimpleSchema([RequiredSchema, {
    standardId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    }
  }]).validator(),

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
    IdSchema, NonConformitiesUpdateSchema, optionsSchema
  ]).validator(),

  run({_id, options, query, ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a non-conformity'
      );
    }

    const NC = NonConformities.findOne({ _id });

    checkAnalysis(NC, args);

    return NonConformitiesService.update({ _id, options, query, ...args });
  }
});

export const setAnalysisExecutor = new ValidatedMethod({
  name: 'NonConformities.setAnalysisExecutor',

  validate: new SimpleSchema([
    IdSchema,
    {
      executor: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
      }
    }
  ]).validator(),

  run({ _id, executor }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannnot update root cause analysis'
      );
    }

    return NonConformitiesService.setAnalysisExecutor({ _id, executor });
  }
});

export const setAnalysisDate = new ValidatedMethod({
  name: 'NonConformities.setAnalysisDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      targetDate: { type: Date }
    }
  ]).validator(),

  run({ _id, ...args }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update root cause analysis'
      );
    }

    return NonConformitiesService.setAnalysisDate({ _id, ...args });
  }
});

export const completeAnalysis = new ValidatedMethod({
  name: 'NonConformities.completeAnalysis',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot complete root cause analysis'
      );
    }

    return NonConformitiesService.completeAnalysis({ _id, userId });
  }
});

export const updateStandards = new ValidatedMethod({
  name: 'NonConformities.updateStandards',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update standards'
      );
    }

    return NonConformitiesService.updateStandards({ _id, userId });
  }
});

export const undoStandardsUpdate = new ValidatedMethod({
  name: 'NonConformities.undoStandardsUpdate',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot undo standards update'
      );
    }

    return NonConformitiesService.undoStandardsUpdate({ _id, userId });
  }
});

export const undoAnalysis = new ValidatedMethod({
  name: 'NonConformities.undoAnalysis',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot undo root cause analysis'
      );
    }

    return NonConformitiesService.undoAnalysis({ _id, userId });
  }
});

export const setStandardsUpdateExecutor = new ValidatedMethod({
  name: 'NonConformities.setStandardsUpdateExecutor',

  validate: new SimpleSchema([
    IdSchema,
    {
      executor: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
      }
    }
  ]).validator(),

  run({ _id, executor }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update standards update'
      );
    }

    return NonConformitiesService.setStandardsUpdateExecutor({ _id, executor });
  }
});

export const setStandardsUpdateDate = new ValidatedMethod({
  name: 'NonConformities.setStandardsUpdateDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      targetDate: { type: Date }
    }
  ]).validator(),

  run({ _id, ...args }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot set date for standards update'
      );
    }

    return NonConformitiesService.setStandardsUpdateDate({ _id, ...args });
  }
});

export const updateViewedBy = new ValidatedMethod({
  name: 'NonConformities.updateViewedBy',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update non-conformities'
      );
    }

    return NonConformitiesService.updateViewedBy({ _id, viewedBy: userId });
  }
});


export const remove = new ValidatedMethod({
  name: 'NonConformities.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove non-conformities'
      );
    }

    return NonConformitiesService.remove({ _id, deletedBy: userId });
  }
});

export const restore = new ValidatedMethod({
  name: 'NonConformities.restore',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot restore non-conformities'
      );
    }

    return NonConformitiesService.restore({ _id });
  }
});
