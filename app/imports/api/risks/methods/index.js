import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import RisksService from '/imports/share/services/risks-service';
import {
  RequiredSchema,
  RiskScoreSchema,
} from '/imports/share/schemas/risks-schema';
import { Risks } from '/imports/share/collections/risks';
import {
  IdSchema,
  CompleteActionSchema,
} from '/imports/share/schemas/schemas';
import Method, { CheckedMethod } from '../../method';
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
import { inject, always, T } from '/imports/api/helpers';

export { default as update } from './update';
export { default as linkStandard } from './linkStandard';

const injectRK = inject(Risks);

export const insert = new Method({
  name: 'Risks.insert',

  validate: new SimpleSchema([RequiredSchema, {
    standardId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
  }]).validator(),

  run({ organizationId, ...args }) {
    checkOrgMembership(this.userId, organizationId);

    return RisksService.insert({ organizationId, ...args });
  },
});

export const setAnalysisExecutor = new CheckedMethod({
  name: 'Risks.setAnalysisExecutor',

  validate: new SimpleSchema([
    IdSchema,
    {
      executor: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
      },
    },
  ]).validator(),

  check: checker => injectRK(checker)(P_OnSetAnalysisExecutorChecker),

  run({ _id, executor }, doc) {
    return RisksService.setAnalysisExecutor({
      _id,
      executor,
      assignedBy: this.userId,
    }, doc);
  },
});

export const setAnalysisDate = new CheckedMethod({
  name: 'Risks.setAnalysisDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      targetDate: { type: Date },
    },
  ]).validator(),

  check: checker => injectRK(checker)(P_OnSetAnalysisDateChecker),

  run({ ...args }, doc) {
    return RisksService.setAnalysisDate({ ...args }, doc);
  },
});

export const setAnalysisCompletedBy = new CheckedMethod({
  name: 'Risks.setAnalysisCompletedBy',

  validate: new SimpleSchema([
    IdSchema,
    {
      completedBy: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
      },
    },
  ]).validator(),

  check: checker => injectRK(checker)(P_OnSetAnalysisCompletedByChecker),

  run({ _id, completedBy }, doc) {
    return RisksService.setAnalysisCompletedBy({ _id, completedBy }, doc);
  },
});

export const setAnalysisCompletedDate = new CheckedMethod({
  name: 'Risks.setAnalysisCompletedDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      completedAt: { type: Date },
    },
  ]).validator(),

  check: checker => injectRK(checker)(P_OnSetAnalysisCompletedDateChecker),

  run({ _id, ...args }, doc) {
    return RisksService.setAnalysisCompletedDate({ _id, ...args }, doc);
  },
});

export const setAnalysisComments = new CheckedMethod({
  name: 'Risks.setAnalysisComments',

  validate: new SimpleSchema([
    IdSchema,
    {
      completionComments: { type: String },
    },
  ]).validator(),

  check: checker => injectRK(checker)(P_OnSetAnalysisCommentsChecker),

  run({ _id, ...args }, doc) {
    return RisksService.setAnalysisComments({ _id, ...args }, doc);
  },
});

export const completeAnalysis = new CheckedMethod({
  name: 'Risks.completeAnalysis',

  validate: CompleteActionSchema.validator(),

  check: checker => injectRK(checker)(P_OnCompleteAnalysisChecker),

  run({ _id, completionComments }) {
    return RisksService.completeAnalysis({ _id, completionComments, userId: this.userId });
  },
});

export const updateStandards = new CheckedMethod({
  name: 'Risks.updateStandards',

  validate: CompleteActionSchema.validator(),

  check: checker => injectRK(checker)(P_OnStandardsUpdateChecker),

  run({ _id, completionComments }) {
    return RisksService.updateStandards({ _id, completionComments, userId: this.userId });
  },
});

export const undoStandardsUpdate = new CheckedMethod({
  name: 'Risks.undoStandardsUpdate',

  validate: IdSchema.validator(),

  check: checker => injectRK(checker)(P_OnUndoStandardsUpdateChecker),

  run({ _id }) {
    return RisksService.undoStandardsUpdate({ _id, userId: this.userId });
  },
});

export const undoAnalysis = new CheckedMethod({
  name: 'Risks.undoAnalysis',

  validate: IdSchema.validator(),

  check: checker => injectRK(checker)(P_OnUndoAnalysisChecker),

  run({ _id }) {
    return RisksService.undoAnalysis({ _id, userId: this.userId });
  },
});

export const setStandardsUpdateExecutor = new CheckedMethod({
  name: 'Risks.setStandardsUpdateExecutor',

  validate: new SimpleSchema([
    IdSchema,
    {
      executor: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
      },
    },
  ]).validator(),

  check: checker => injectRK(checker)(P_OnSetStandardsUpdateExecutorChecker),

  run({ _id, executor }, doc) {
    return RisksService.setStandardsUpdateExecutor({
      _id,
      executor,
      assignedBy: this.userId,
    }, doc);
  },
});

export const setStandardsUpdateDate = new CheckedMethod({
  name: 'Risks.setStandardsUpdateDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      targetDate: { type: Date },
    },
  ]).validator(),

  check: checker => injectRK(checker)(P_OnSetStandardsUpdateDateChecker),

  run({ ...args }, doc) {
    return RisksService.setStandardsUpdateDate({ ...args }, doc);
  },
});

export const setStandardsUpdateCompletedBy = new CheckedMethod({
  name: 'Risks.setStandardsUpdateCompletedBy',

  validate: new SimpleSchema([
    IdSchema,
    {
      completedBy: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
      },
    },
  ]).validator(),

  check: checker => injectRK(checker)(P_OnSetStandardsUpdateCompletedByChecker),

  run({ _id, completedBy }, doc) {
    return RisksService.setStandardsUpdateCompletedBy({ _id, completedBy }, doc);
  },
});

export const setStandardsUpdateCompletedDate = new CheckedMethod({
  name: 'Risks.setStandardsUpdateCompletedDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      completedAt: { type: Date },
    },
  ]).validator(),

  check: checker => injectRK(checker)(P_OnSetStandardsUpdateCompletedDateChecker),

  run({ _id, ...args }, doc) {
    return RisksService.setStandardsUpdateCompletedDate({ _id, ...args }, doc);
  },
});

export const setStandardsUpdateComments = new CheckedMethod({
  name: 'Risks.setStandardsUpdateComments',

  validate: new SimpleSchema([
    IdSchema,
    {
      completionComments: { type: String },
    },
  ]).validator(),

  check: checker => injectRK(checker)(P_OnSetStandardsUpdateCommentsChecker),

  run({ _id, ...args }, doc) {
    return RisksService.setStandardsUpdateComments({ _id, ...args }, doc);
  },
});


export const updateViewedBy = new CheckedMethod({
  name: 'Risks.updateViewedBy',

  validate: IdSchema.validator(),

  check: checker => injectRK(checker)(always(T)),

  run({ _id }) {
    return RisksService.updateViewedBy({ _id, viewedBy: this.userId });
  },
});

export const remove = new CheckedMethod({
  name: 'Risks.remove',

  validate: IdSchema.validator(),

  check: checker => injectRK(checker)(onRemoveChecker),

  run({ _id }) {
    return RisksService.remove({ _id, deletedBy: this.userId });
  },
});

export const restore = new CheckedMethod({
  name: 'Risks.restore',

  validate: IdSchema.validator(),

  check: checker => injectRK(checker)(onRestoreChecker),

  run({ _id }) {
    return RisksService.restore({ _id });
  },
});

export const insertScore = new CheckedMethod({
  name: 'Risks.scores.insert',

  validate: new SimpleSchema([IdSchema, RiskScoreSchema]).validator(),

  check: checker => injectRK(checker)(always(T)),

  run({ ...args }) {
    return RisksService['scores.insert']({ ...args });
  },
});

export const removeScore = new CheckedMethod({
  name: 'Risks.scores.remove',

  validate: new SimpleSchema([IdSchema, {
    score: {
      type: RiskScoreSchema,
    },
  }]).validator(),

  check: checker => injectRK(checker)(always(T)),

  run({ _id, score }) {
    return RisksService['scores.remove']({ _id, score });
  },
});
