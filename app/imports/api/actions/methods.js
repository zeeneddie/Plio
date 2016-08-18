import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import curry from 'lodash.curry';

import ActionService from './action-service.js';
import { ActionSchema, RequiredSchema } from './action-schema.js';
import { Actions } from './actions.js';
import { IdSchema, optionsSchema, StandardIdSchema, CompleteActionSchema } from '../schemas.js';
import { ProblemTypes } from '../constants.js';
import Method, { CheckedMethod } from '../method.js';
import {
  checkOrgMembership,
  onRemoveChecker,
  onRestoreChecker,
  ACT_Check,
  ACT_CheckEverything,
  ACT_OnLinkChecker,
  ACT_OnCompleteChecker,
  ACT_OnUndoCompletionChecker,
  ACT_OnVerifyChecker,
  ACT_OnUndoVerificationChecker,
  ACT_LinkedDocsChecker
} from '../checkers.js';
import { chain, checkAndThrow } from '../helpers.js';
import {
  ACT_CANNOT_SET_TARGET_DATE_FOR_COMPLETED,
  ACT_CANNOT_SET_EXECUTOR_FOR_COMPLETED,
  ACT_CANNOT_SET_VERIFICATION_DATE_FOR_VERIFIED,
  ACT_CANNOT_SET_EXECUTOR_FOR_VERIFIED,
  ACT_NOT_LINKED
} from '../errors.js';


const act = fn => fn(Actions);

export const insert = new Method({
  name: 'Actions.insert',

  validate(doc) {
    RequiredSchema.clean(doc, {
      removeEmptyStrings: true
    });

    return RequiredSchema.validator()(doc);
  },

  run({ organizationId, linkedTo, ...args }) {
    checkOrgMembership(this.userId, organizationId);

    ACT_LinkedDocsChecker(linkedTo);

    return ActionService.insert({ organizationId, linkedTo, ...args });
  }
});

export const update = new CheckedMethod({
  name: 'Actions.update',

  validate(doc) {
    const schema = new SimpleSchema([
      IdSchema, ActionSchema, optionsSchema
    ]);

    const validationContext = schema.newContext();

    _.each(
      _.filter(_.keys(doc), key => doc[key] === ''),
      key => {
        const fieldDef = schema.getDefinition(key);
        if (fieldDef.optional !== true) {
          doc[key] = undefined
        }
      }
    );

    for (let key in doc) {
      if (!validationContext.validateOne(doc, key)) {
        const errors = validationContext.invalidKeys();
        const message = validationContext.keyErrorMessage(errors[0].name);
        throw new ValidationError(errors, message);
      }
    }
  },

  check: checker => act(checker),

  run({ _id, ...args }) {
    return ActionService.update({ _id, ...args });
  }
});

export const updateViewedBy = new Method({
  name: 'Actions.updateViewedBy',

  validate: IdSchema.validator(),

  check: checker => act(checker),

  run({ _id }) {
    return ActionService.updateViewedBy({ _id, userId: this.userId });
  }
});

export const setCompletionDate = new CheckedMethod({
  name: 'Actions.setCompletionDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      targetDate: { type: Date }
    }
  ]).validator(),

  check(checker) {
    return act(checker)(() => action => action.completed(), ACT_CANNOT_SET_TARGET_DATE_FOR_COMPLETED);
  },

  run({ _id, ...args }) {
    return ActionService.setCompletionDate({ _id, ...args });
  }
});

export const setCompletionExecutor = new CheckedMethod({
  name: 'Actions.setCompletionExecutor',

  validate: new SimpleSchema([
    IdSchema,
    {
      userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
      }
    }
  ]).validator(),

  check(checker) {
    return act(checker)(() => action => action.completed(), ACT_CANNOT_SET_EXECUTOR_FOR_COMPLETED);
  },

  run({ _id, ...args }) {
    return ActionService.setCompletionExecutor({ _id, ...args });
  }
});

export const setVerificationDate = new CheckedMethod({
  name: 'Actions.setVerificationDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      targetDate: { type: Date }
    }
  ]).validator(),

  check(checker) {
    return act(checker)(() => action => action.verified(), ACT_CANNOT_SET_VERIFICATION_DATE_FOR_VERIFIED);
  },

  run({ _id, ...args }) {
    return ActionService.setVerificationDate({ _id, ...args });
  }
});

export const setVerificationExecutor = new CheckedMethod({
  name: 'Actions.setVerificationExecutor',

  validate: new SimpleSchema([
    IdSchema,
    {
      userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
      }
    }
  ]).validator(),

  check(checker) {
    return act(checker)(() => action => action.verified(), ACT_CANNOT_SET_EXECUTOR_FOR_VERIFIED)
  },

  run({ _id, ...args }) {
    return ActionService.setVerificationExecutor({ _id, ...args });
  }
});

export const linkDocument = new CheckedMethod({
  name: 'Actions.linkDocument',

  validate: new SimpleSchema([
    IdSchema,
    {
      documentId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
      },
      documentType: {
        type: String,
        allowedValues: _.values(ProblemTypes)
      }
    }
  ]).validator(),

  check: checker => act(checker)(ACT_OnLinkChecker),

  run(...args) {
    return ActionService.linkDocument(...args);
  }
});

export const unlinkDocument = new CheckedMethod({
  name: 'Actions.unlinkDocument',

  validate: new SimpleSchema([
    IdSchema,
    {
      documentId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
      },
      documentType: {
        type: String,
        allowedValues: _.values(ProblemTypes)
      }
    }
  ]).validator(),

  check(checker) {
    const _checker = ({ documentId, documentType }) => {
       return (action) => {
         return !action.isLinkedToDocument(documentId, documentType);
       };
    };

    return act(checker)(_checker, ACT_NOT_LINKED);
  },

  run({ _id, documentId, documentType }) {
    return ActionService.unlinkDocument({ _id, documentId, documentType });
  }
});

export const complete = new CheckedMethod({
  name: 'Actions.complete',

  validate: CompleteActionSchema.validator(),

  check: checker => act(checker)(ACT_OnCompleteChecker),

  run({ _id, ...args }) {
    return ActionService.complete({ _id, ...args, userId: this.userId });
  }
});

export const undoCompletion = new CheckedMethod({
  name: 'Actions.undoCompletion',

  validate: IdSchema.validator(),

  check: checker => act(checker)(ACT_OnUndoCompletionChecker),

  run({ _id }) {
    return ActionService.undoCompletion({ _id, userId: this.userId });
  }
});

export const verify = new CheckedMethod({
  name: 'Actions.verify',

  validate: new SimpleSchema([
    IdSchema,
    {
      success: { type: Boolean },
      verificationComments: { type: String }
    }
  ]).validator(),

  check: checker => act(checker)(ACT_OnVerifyChecker),

  run({ _id, ...args }) {
    return ActionService.verify({ _id, userId: this.userId, ...args });
  }
});

export const undoVerification = new CheckedMethod({
  name: 'Actions.undoVerification',

  validate: IdSchema.validator(),

  check: checker => act(checker)(ACT_OnUndoVerificationChecker),

  run({ _id }, { action }) {
    return ActionService.undoVerification({ _id, userId: this.userId }, { action });
  }
});

export const remove = new CheckedMethod({
  name: 'Actions.remove',

  validate: IdSchema.validator(),

  check: checker => act(checker)(onRemoveChecker),

  run({ _id }) {
    return ActionService.remove({ _id, deletedBy: this.userId });
  }
});

export const restore = new CheckedMethod({
  name: 'Actions.restore',

  validate: IdSchema.validator(),

  check: checker => act(checker)(onRestoreChecker),

  run({ _id }) {
    return ActionService.restore({ _id });
  }
});
