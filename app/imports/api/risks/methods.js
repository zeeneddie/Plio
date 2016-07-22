import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import RisksService from './risks-service.js';
import { RisksUpdateSchema, RequiredSchema, RiskScoreSchema } from './risks-schema.js';
import { Risks } from './risks.js';
import {
  IdSchema,
  OrganizationIdSchema,
  optionsSchema,
  UserIdSchema
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

export const updateViewedBy = new ValidatedMethod({
  name: 'Risks.updateViewedBy',

  validate: IdSchema.validator(),

  run({ _id }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a risk'
      );
    }

    return RisksService.updateViewedBy({ _id, userId: this.userId });
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
