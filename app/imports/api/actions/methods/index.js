/* eslint-disable camelcase */

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import ActionService from '/imports/share/services/action-service';
import { RequiredSchema } from '/imports/share/schemas/action-schema';
import { Actions } from '/imports/share/collections/actions';
import { IdSchema } from '/imports/share/schemas/schemas';
import { AllowedActionLinkedDocTypes } from '/imports/share/constants';
import Method, { CheckedMethod } from '../../method';
import {
  checkOrgMembership,
  onRemoveChecker,
  onRestoreChecker,
  ACT_OnLinkChecker,
  ACT_LinkedDocsChecker,
} from '../../checkers';
import { inject, always, T } from '../../helpers';
import {
  ACT_CANNOT_SET_TARGET_DATE_FOR_COMPLETED,
  ACT_CANNOT_SET_EXECUTOR_FOR_COMPLETED,
  ACT_CANNOT_SET_VERIFICATION_DATE_FOR_VERIFIED,
  ACT_CANNOT_SET_EXECUTOR_FOR_VERIFIED,
  ACT_NOT_LINKED,
} from '../../errors';

export { default as update } from './update';
export { default as complete } from './complete';
export { default as undoCompletion } from './undoCompletion';
export { default as verify } from './verify';
export { default as undoVerification } from './undoVerification';

const injectACT = inject(Actions);

export const insert = new Method({
  name: 'Actions.insert',

  validate(doc) {
    RequiredSchema.clean(doc, {
      removeEmptyStrings: true,
    });

    return RequiredSchema.validator()(doc);
  },

  run({ organizationId, linkedTo, ...args }) {
    checkOrgMembership(this.userId, organizationId);

    ACT_LinkedDocsChecker(linkedTo);

    return ActionService.insert({
      organizationId,
      linkedTo,
      completionAssignedBy: this.userId,
      ...args,
    });
  },
});

export const updateViewedBy = new CheckedMethod({
  name: 'Actions.updateViewedBy',

  validate: IdSchema.validator(),

  check: checker => injectACT(checker)(always(T)),

  run({ _id }) {
    return ActionService.updateViewedBy({ _id, userId: this.userId });
  },
});

export const setCompletionDate = new CheckedMethod({
  name: 'Actions.setCompletionDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      targetDate: { type: Date },
    },
  ]).validator(),

  check(checker) {
    return injectACT(checker)(
      () => action => action.completed(),
      ACT_CANNOT_SET_TARGET_DATE_FOR_COMPLETED,
    );
  },

  run({ _id, ...args }) {
    return ActionService.setCompletionDate({ _id, ...args });
  },
});

export const setCompletionExecutor = new CheckedMethod({
  name: 'Actions.setCompletionExecutor',

  validate: new SimpleSchema([
    IdSchema,
    {
      userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
      },
    },
  ]).validator(),

  check(checker) {
    return injectACT(checker)(
      () => action => action.completed(),
      ACT_CANNOT_SET_EXECUTOR_FOR_COMPLETED,
    );
  },

  run({ _id, ...args }) {
    return ActionService.setCompletionExecutor({
      _id,
      assignedBy: this.userId,
      ...args,
    });
  },
});

export const setVerificationDate = new CheckedMethod({
  name: 'Actions.setVerificationDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      targetDate: { type: Date },
    },
  ]).validator(),

  check(checker) {
    return injectACT(checker)(
      () => action => action.verified(),
      ACT_CANNOT_SET_VERIFICATION_DATE_FOR_VERIFIED,
    );
  },

  run({ _id, ...args }) {
    return ActionService.setVerificationDate({ _id, ...args });
  },
});

export const setVerificationExecutor = new CheckedMethod({
  name: 'Actions.setVerificationExecutor',

  validate: new SimpleSchema([
    IdSchema,
    {
      userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
      },
    },
  ]).validator(),

  check(checker) {
    return injectACT(checker)(
      () => action => action.verified(),
      ACT_CANNOT_SET_EXECUTOR_FOR_VERIFIED,
    );
  },

  run({ _id, ...args }) {
    return ActionService.setVerificationExecutor({
      _id,
      assignedBy: this.userId,
      ...args,
    });
  },
});

export const linkDocument = new CheckedMethod({
  name: 'Actions.linkDocument',

  validate: new SimpleSchema([
    IdSchema,
    {
      documentId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
      },
      documentType: {
        type: String,
        allowedValues: AllowedActionLinkedDocTypes,
      },
    },
  ]).validator(),

  check(checker) {
    if (this.isSimulation) return undefined;

    return injectACT(checker)(ACT_OnLinkChecker);
  },

  run(...args) {
    if (this.isSimulation) return undefined;

    return ActionService.linkDocument(...args);
  },
});

export const unlinkDocument = new CheckedMethod({
  name: 'Actions.unlinkDocument',

  validate: new SimpleSchema([
    IdSchema,
    {
      documentId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
      },
      documentType: {
        type: String,
        allowedValues: AllowedActionLinkedDocTypes,
      },
    },
  ]).validator(),

  check(checker) {
    const _checker = ({ documentId, documentType }) => action =>
      !action.isLinkedToDocument(documentId, documentType);

    return injectACT(checker)(_checker, ACT_NOT_LINKED);
  },

  run({ _id, documentId, documentType }) {
    return ActionService.unlinkDocument({ _id, documentId, documentType });
  },
});

export const remove = new CheckedMethod({
  name: 'Actions.remove',

  validate: IdSchema.validator(),

  check: checker => injectACT(checker)(onRemoveChecker),

  run({ _id }) {
    return ActionService.remove({ _id, deletedBy: this.userId });
  },
});

export const restore = new CheckedMethod({
  name: 'Actions.restore',

  validate: IdSchema.validator(),

  check: checker => injectACT(checker)(onRestoreChecker),

  run({ _id }) {
    return ActionService.restore({ _id });
  },
});
