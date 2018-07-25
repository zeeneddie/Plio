import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import NonConformitiesService from '/imports/share/services/non-conformities-service';
import { RequiredSchema } from '/imports/share/schemas/non-conformities-schema';
import { NonConformities } from '/imports/share/collections/non-conformities';
import {
  IdSchema,
  CompleteActionSchema,
} from '/imports/share/schemas/schemas';
import Method, { CheckedMethod } from '../../method';
import { inject, always, T } from '/imports/api/helpers';
import {
  checkOrgMembership,
  onRemoveChecker,
  onRestoreChecker,
  P_OnSetAnalysisExecutorChecker,
  P_OnSetAnalysisDateChecker,
  P_OnCompleteAnalysisChecker,
  P_OnStandardsUpdateChecker,
  P_OnUndoStandardsUpdateChecker,
  P_OnUndoAnalysisChecker,
  P_OnSetStandardsUpdateExecutorChecker,
  P_OnSetStandardsUpdateDateChecker,
  P_OnSetAnalysisCompletedByChecker,
  P_OnSetAnalysisCompletedDateChecker,
  P_OnSetAnalysisCommentsChecker,
  P_OnSetStandardsUpdateCompletedByChecker,
  P_OnSetStandardsUpdateCompletedDateChecker,
  P_OnSetStandardsUpdateCommentsChecker,
} from '../../checkers';

export { default as update } from './update';

const injectNC = inject(NonConformities);

export const insert = new Method({
  name: 'NonConformities.insert',

  validate: new SimpleSchema([RequiredSchema, {
    standardId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
  }]).validator(),

  run({ organizationId, ...args }) {
    checkOrgMembership(this.userId, organizationId);

    return NonConformitiesService.insert({ organizationId, ...args });
  },
});

export const setAnalysisExecutor = new CheckedMethod({
  name: 'NonConformities.setAnalysisExecutor',

  validate: new SimpleSchema([
    IdSchema,
    {
      executor: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
      },
    },
  ]).validator(),

  check: checker => injectNC(checker)(P_OnSetAnalysisExecutorChecker),

  run({ _id, executor }, doc) {
    return NonConformitiesService.setAnalysisExecutor({
      _id,
      executor,
      assignedBy: this.userId,
    }, doc);
  },
});

export const setAnalysisDate = new CheckedMethod({
  name: 'NonConformities.setAnalysisDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      targetDate: { type: Date },
    },
  ]).validator(),

  check: checker => injectNC(checker)(P_OnSetAnalysisDateChecker),

  run({ ...args }, doc) {
    return NonConformitiesService.setAnalysisDate({ ...args }, doc);
  },
});

export const setAnalysisCompletedBy = new CheckedMethod({
  name: 'NonConformities.setAnalysisCompletedBy',

  validate: new SimpleSchema([
    IdSchema,
    {
      completedBy: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
      },
    },
  ]).validator(),

  check: checker => injectNC(checker)(P_OnSetAnalysisCompletedByChecker),

  run({ _id, completedBy }, doc) {
    return NonConformitiesService.setAnalysisCompletedBy({ _id, completedBy }, doc);
  },
});

export const setAnalysisCompletedDate = new CheckedMethod({
  name: 'NonConformities.setAnalysisCompletedDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      completedAt: { type: Date },
    },
  ]).validator(),

  check: checker => injectNC(checker)(P_OnSetAnalysisCompletedDateChecker),

  run({ _id, ...args }, doc) {
    return NonConformitiesService.setAnalysisCompletedDate({ _id, ...args }, doc);
  },
});

export const setAnalysisComments = new CheckedMethod({
  name: 'NonConformities.setAnalysisComments',

  validate: new SimpleSchema([
    IdSchema,
    {
      completionComments: { type: String },
    },
  ]).validator(),

  check: checker => injectNC(checker)(P_OnSetAnalysisCommentsChecker),

  run({ _id, ...args }, doc) {
    return NonConformitiesService.setAnalysisComments({ _id, ...args }, doc);
  },
});

export const completeAnalysis = new CheckedMethod({
  name: 'NonConformities.completeAnalysis',

  validate: CompleteActionSchema.validator(),

  check: checker => injectNC(checker)(P_OnCompleteAnalysisChecker),

  run({ _id, completionComments }) {
    return NonConformitiesService.completeAnalysis({
      _id,
      completionComments,
      userId: this.userId,
    });
  },
});

export const updateStandards = new CheckedMethod({
  name: 'NonConformities.updateStandards',

  validate: CompleteActionSchema.validator(),

  check: checker => injectNC(checker)(P_OnStandardsUpdateChecker),

  run({ _id, completionComments }) {
    return NonConformitiesService.updateStandards({ _id, completionComments, userId: this.userId });
  },
});

export const undoStandardsUpdate = new CheckedMethod({
  name: 'NonConformities.undoStandardsUpdate',

  validate: IdSchema.validator(),

  check: checker => injectNC(checker)(P_OnUndoStandardsUpdateChecker),

  run({ _id }) {
    return NonConformitiesService.undoStandardsUpdate({ _id, userId: this.userId });
  },
});

export const undoAnalysis = new CheckedMethod({
  name: 'NonConformities.undoAnalysis',

  validate: IdSchema.validator(),

  check: checker => injectNC(checker)(P_OnUndoAnalysisChecker),

  run({ _id }) {
    return NonConformitiesService.undoAnalysis({ _id, userId: this.userId });
  },
});

export const setStandardsUpdateExecutor = new CheckedMethod({
  name: 'NonConformities.setStandardsUpdateExecutor',

  validate: new SimpleSchema([
    IdSchema,
    {
      executor: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
      },
    },
  ]).validator(),

  check: checker => injectNC(checker)(P_OnSetStandardsUpdateExecutorChecker),

  run({ _id, executor }, doc) {
    return NonConformitiesService.setStandardsUpdateExecutor({
      _id,
      executor,
      assignedBy: this.userId,
    }, doc);
  },
});

export const setStandardsUpdateDate = new CheckedMethod({
  name: 'NonConformities.setStandardsUpdateDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      targetDate: { type: Date },
    },
  ]).validator(),

  check: checker => injectNC(checker)(P_OnSetStandardsUpdateDateChecker),

  run({ _id, ...args }, doc) {
    return NonConformitiesService.setStandardsUpdateDate({ _id, ...args }, doc);
  },
});

export const setStandardsUpdateCompletedBy = new CheckedMethod({
  name: 'NonConformities.setStandardsUpdateCompletedBy',

  validate: new SimpleSchema([
    IdSchema,
    {
      completedBy: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
      },
    },
  ]).validator(),

  check: checker => injectNC(checker)(P_OnSetStandardsUpdateCompletedByChecker),

  run({ _id, completedBy }, doc) {
    return NonConformitiesService.setStandardsUpdateCompletedBy({ _id, completedBy }, doc);
  },
});

export const setStandardsUpdateCompletedDate = new CheckedMethod({
  name: 'NonConformities.setStandardsUpdateCompletedDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      completedAt: { type: Date },
    },
  ]).validator(),

  check: checker => injectNC(checker)(P_OnSetStandardsUpdateCompletedDateChecker),

  run({ _id, ...args }, doc) {
    return NonConformitiesService.setStandardsUpdateCompletedDate({ _id, ...args }, doc);
  },
});

export const setStandardsUpdateComments = new CheckedMethod({
  name: 'NonConformities.setStandardsUpdateComments',

  validate: new SimpleSchema([
    IdSchema,
    {
      completionComments: { type: String },
    },
  ]).validator(),

  check: checker => injectNC(checker)(P_OnSetStandardsUpdateCommentsChecker),

  run({ _id, ...args }, doc) {
    return NonConformitiesService.setStandardsUpdateComments({ _id, ...args }, doc);
  },
});


export const updateViewedBy = new CheckedMethod({
  name: 'NonConformities.updateViewedBy',

  validate: IdSchema.validator(),

  check: checker => injectNC(checker)(always(T)),

  run({ _id }) {
    return NonConformitiesService.updateViewedBy({ _id, viewedBy: this.userId });
  },
});

export const remove = new CheckedMethod({
  name: 'NonConformities.remove',

  validate: IdSchema.validator(),

  check: checker => injectNC(checker)(onRemoveChecker),

  run({ _id }) {
    return NonConformitiesService.remove({ _id, deletedBy: this.userId });
  },
});

export const restore = new CheckedMethod({
  name: 'NonConformities.restore',

  validate: IdSchema.validator(),

  check: checker => injectNC(checker)(onRestoreChecker),

  run({ _id }) {
    return NonConformitiesService.restore({ _id });
  },
});
