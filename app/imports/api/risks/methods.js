import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import RisksService from './risks-service.js';
import { RisksUpdateSchema, RequiredSchema, RiskScoreSchema } from './risks-schema.js';
import { Risks } from './risks.js';
import {
  IdSchema,
  OrganizationIdSchema,
  optionsSchema,
  UserIdSchema,
  CompleteActionSchema
} from '../schemas.js';

import { checkAnalysis } from '../checkers.js';

export const insert = new ValidatedMethod({
  name: 'Risks.insert',

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
        403, 'Unauthorized user cannot create a risk'
      );
    }

    return RisksService.insert({ ...args });
  }
});

export const update = new ValidatedMethod({
  name: 'Risks.update',

  validate: new SimpleSchema([
    IdSchema, RisksUpdateSchema, optionsSchema
  ]).validator(),

  run({ _id, options, query, ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a risk'
      );
    }

    const risk = Risks.findOne({ _id });

    if (!risk) {
      throw new Meteor.Error(
        400, 'Risk does not exist'
      );
    }

    checkAnalysis(risk, args);

    if (_.has('args', ['scoredBy', 'scoredAt']) && !risk.score) {
      throw new Meteor.Error(
        403, 'Access denied'
      )
    }

    return RisksService.update({ _id, options, query, ...args });
  }
});

export const setAnalysisExecutor = new ValidatedMethod({
  name: 'Risks.setAnalysisExecutor',

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

    return RisksService.setAnalysisExecutor({ _id, executor });
  }
});

export const setAnalysisDate = new ValidatedMethod({
  name: 'Risks.setAnalysisDate',

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

    return RisksService.setAnalysisDate({ _id, ...args });
  }
});

export const completeAnalysis = new ValidatedMethod({
  name: 'Risks.completeAnalysis',

  validate: CompleteActionSchema.validator(),

  run({ _id, completionComments }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot complete root cause analysis'
      );
    }

    return RisksService.completeAnalysis({ _id, completionComments, userId });
  }
});

export const updateStandards = new ValidatedMethod({
  name: 'Risks.updateStandards',

  validate: CompleteActionSchema.validator(),

  run({ _id, completionComments }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update standards'
      );
    }

    return RisksService.updateStandards({ _id, completionComments, userId });
  }
});

export const undoStandardsUpdate = new ValidatedMethod({
  name: 'Risks.undoStandardsUpdate',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot undo standards update'
      );
    }

    return RisksService.undoStandardsUpdate({ _id, userId });
  }
});

export const undoAnalysis = new ValidatedMethod({
  name: 'Risks.undoAnalysis',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot undo root cause analysis'
      );
    }

    return RisksService.undoAnalysis({ _id, userId });
  }
});

export const setStandardsUpdateExecutor = new ValidatedMethod({
  name: 'Risks.setStandardsUpdateExecutor',

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

    return RisksService.setStandardsUpdateExecutor({ _id, executor });
  }
});

export const setStandardsUpdateDate = new ValidatedMethod({
  name: 'Risks.setStandardsUpdateDate',

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

    return RisksService.setStandardsUpdateDate({ _id, ...args });
  }
});

export const updateViewedBy = new ValidatedMethod({
  name: 'Risks.updateViewedBy',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a risk'
      );
    }

    return RisksService.updateViewedBy({ _id, viewedBy: userId });
  }
});

export const remove = new ValidatedMethod({
  name: 'Risks.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove risks'
      );
    }

    return RisksService.remove({ _id, deletedBy: userId });
  }
});

export const restore = new ValidatedMethod({
  name: 'Risks.restore',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot restore risks'
      );
    }

    return RisksService.restore({ _id });
  }
});

export const insertScore = new ValidatedMethod({
  name: 'Risks.scores.insert',

  validate: new SimpleSchema([IdSchema, RiskScoreSchema]).validator(),

  run({ _id, ...args }) {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot score a risk'
      );
    }

    const risk = Risks.findOne({ _id });

    if (!risk) {
      throw new Meteor.Error(
        400, 'Risk with the given id does not exist'
      );
    }

    return RisksService['scores.insert']({ _id, ...args });
  }
});

export const removeScore = new ValidatedMethod({
  name: 'Risks.scores.remove',

  validate: new SimpleSchema([IdSchema, {
    score: {
      type: RiskScoreSchema
    }
  }]).validator(),

  run({ _id, score }) {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove a score'
      );
    }

    const risk = Risks.findOne({ _id });

    if (!risk) {
      throw new Meteor.Error(
        400, 'Risk with the given id does not exist'
      );
    }

    return RisksService['scores.remove']({ _id, score });
  }
});
