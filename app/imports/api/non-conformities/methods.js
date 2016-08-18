import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import NonConformitiesService from './non-conformities-service.js';
import { NonConformitiesUpdateSchema, RequiredSchema } from './non-conformities-schema.js';
import { NonConformities } from './non-conformities.js';
import {
  IdSchema,
  OrganizationIdSchema,
  optionsSchema,
  UserIdSchema,
  CompleteActionSchema
} from '../schemas.js';
import Method, { CheckedMethod } from '../method.js';
import {
  checkOrgMembership,
  checkAnalysis,
  onRemoveChecker,
  onRestoreChecker,
  P_OnSetAnalysisExecutorChecker,
  P_OnSetAnalysisDateChecker,
  P_OnCompleteAnalysisChecker,
  P_OnStandardsUpdateChecker,
  P_OnUndoStandardsUpdateChecker,
  P_OnUndoAnalysisChecker,
  P_OnSetStandardsUpdateExecutorChecker,
  P_OnSetStandardsUpdateDateChecker
} from '../checkers.js';

const inject = fn => fn(NonConformities);

export const insert = new Method({
  name: 'NonConformities.insert',

  validate: new SimpleSchema([RequiredSchema, {
    standardId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    }
  }]).validator(),

  run({ organizationId, ...args }) {
    checkOrgMembership(this.userId, organizationId);

    return NonConformitiesService.insert({ organizationId, ...args });
  }
});

export const update = new CheckedMethod({
  name: 'NonConformities.update',

  validate: new SimpleSchema([
    IdSchema, NonConformitiesUpdateSchema, optionsSchema
  ]).validator(),

  check(checker) {
    const _checker = (...args) => {
      return (doc) => {
        return checkAnalysis(doc, args);
      };
    };

    inject(checker)(_checker);
  },

  run({ ...args }) {
    return NonConformitiesService.update({ ...args });
  }
});

export const setAnalysisExecutor = new CheckedMethod({
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

  check: checker => inject(checker)(P_OnSetAnalysisExecutorChecker),

  run({ _id, executor }, doc) {
    return NonConformitiesService.setAnalysisExecutor({ _id, executor }, doc);
  }
});

export const setAnalysisDate = new CheckedMethod({
  name: 'NonConformities.setAnalysisDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      targetDate: { type: Date }
    }
  ]).validator(),

  check: checker => inject(checker)(P_OnSetAnalysisDateChecker),

  run({ ...args }, doc) {
    return NonConformitiesService.setAnalysisDate({ ...args }, doc);
  }
});

export const completeAnalysis = new CheckedMethod({
  name: 'NonConformities.completeAnalysis',

  validate: CompleteActionSchema.validator(),

  check: checker => inject(checker)(P_OnCompleteAnalysisChecker),

  run({ _id, completionComments }) {
    return NonConformitiesService.completeAnalysis({ _id, completionComments, userId: this.userId });
  }
});

export const updateStandards = new CheckedMethod({
  name: 'NonConformities.updateStandards',

  validate: CompleteActionSchema.validator(),

  check: checker => inject(checker)(P_OnStandardsUpdateChecker),

  run({ _id, completionComments }) {
    return NonConformitiesService.updateStandards({ _id, completionComments, userId: this.userId });
  }
});

export const undoStandardsUpdate = new CheckedMethod({
  name: 'NonConformities.undoStandardsUpdate',

  validate: IdSchema.validator(),

  check: checker => inject(checker)(P_OnUndoStandardsUpdateChecker),

  run({ _id }) {
    return NonConformitiesService.undoStandardsUpdate({ _id, userId: this.userId });
  }
});

export const undoAnalysis = new CheckedMethod({
  name: 'NonConformities.undoAnalysis',

  validate: IdSchema.validator(),

  check: checker => inject(checker)(P_OnUndoAnalysisChecker),

  run({ _id }) {
    return NonConformitiesService.undoAnalysis({ _id, userId: this.userId });
  }
});

export const setStandardsUpdateExecutor = new CheckedMethod({
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

  check: checker => inject(checker)(P_OnSetStandardsUpdateExecutorChecker),

  run({ _id, executor }, doc) {
    return NonConformitiesService.setStandardsUpdateExecutor({ _id, executor }, doc);
  }
});

export const setStandardsUpdateDate = new CheckedMethod({
  name: 'NonConformities.setStandardsUpdateDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      targetDate: { type: Date }
    }
  ]).validator(),

  check: checker => inject(checker)(P_OnSetStandardsUpdateDateChecker),

  run({ _id, ...args }, doc) {
    return NonConformitiesService.setStandardsUpdateDate({ _id, ...args }, doc);
  }
});

export const updateViewedBy = new CheckedMethod({
  name: 'NonConformities.updateViewedBy',

  validate: IdSchema.validator(),

  check: checker => inject(checker),

  run({ _id }) {
    return NonConformitiesService.updateViewedBy({ _id, viewedBy: this.userId });
  }
});

export const remove = new CheckedMethod({
  name: 'NonConformities.remove',

  validate: IdSchema.validator(),

  check: checker => inject(checker)(onRemoveChecker),

  run({ _id }) {
    return NonConformitiesService.remove({ _id, deletedBy: this.userId });
  }
});

export const restore = new CheckedMethod({
  name: 'NonConformities.restore',

  validate: IdSchema.validator(),

  check: checker => inject(checker)(onRestoreChecker),

  run({ _id }) {
    return NonConformitiesService.restore({ _id });
  }
});
