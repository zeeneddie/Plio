import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import curry from 'lodash.curry';

import ActionService from './action-service.js';
import { ActionSchema, RequiredSchema } from './action-schema.js';
import { Actions } from './actions.js';
import { IdSchema, optionsSchema, StandardIdSchema, CompleteActionSchema } from '../schemas.js';
import { ProblemTypes } from '../constants.js';
import Method from '../method.js';
import {
  checkOrgMembership,
  ACT_Check,
  ACT_CheckEverything,
  ACT_OnLinkChecker,
  ACT_OnCompleteChecker,
  ACT_OnUndoCompletionChecker,
  ACT_OnVerifyChecker,
  ACT_OnUndoVerificationChecker,
  ACT_OnRemoveChecker,
  ACT_OnRestoreChecker,
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

export const update = new Method({
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

  run({ _id, ...args }) {
    ACT_Check.call(this, _id);

    return ActionService.update({ _id, ...args });
  }
});

export const updateViewedBy = new Method({
  name: 'Actions.updateViewedBy',

  validate: IdSchema.validator(),

  run({ _id }) {
    ACT_Check.call(this, _id);

    return ActionService.updateViewedBy({ _id, userId: this.userId });
  }
});

export const setCompletionDate = new Method({
  name: 'Actions.setCompletionDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      targetDate: { type: Date }
    }
  ]).validator(),

  run({ _id, ...args }) {
    // receives _id and returns a function that receives predicate and error to be thrown if predicate is passed
    ACT_CheckEverything.call(this, _id)(action => action.completed(), ACT_CANNOT_SET_TARGET_DATE_FOR_COMPLETED);

    return ActionService.setCompletionDate({ _id, ...args });
  }
});

export const setCompletionExecutor = new Method({
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

  run({ _id, ...args }) {
    ACT_CheckEverything.call(this, _id)(action => action.completed(), ACT_CANNOT_SET_EXECUTOR_FOR_COMPLETED);

    return ActionService.setCompletionExecutor({ _id, ...args });
  }
});

export const setVerificationDate = new Method({
  name: 'Actions.setVerificationDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      targetDate: { type: Date }
    }
  ]).validator(),

  run({ _id, ...args }) {
    ACT_CheckEverything.call(this, _id)(action => action.verified(), ACT_CANNOT_SET_VERIFICATION_DATE_FOR_VERIFIED);

    return ActionService.setVerificationDate({ _id, ...args });
  }
});

export const setVerificationExecutor = new Method({
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

  run({ _id, ...args }) {
    ACT_CheckEverything.call(this, _id)(action => action.verified(), ACT_CANNOT_SET_EXECUTOR_FOR_VERIFIED);

    return ActionService.setVerificationExecutor({ _id, ...args });
  }
});

export const linkDocument = new Method({
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

  run({ _id, ...args }) {
    const checker = curry(ACT_OnLinkChecker)({ ...args });
    // if error is not passed as argument then it simply runs predicate
    // (checker) is equivalent to (action => ACT_OnLinkChecker({ ...args }, action)) but more functional
    const { doc, action } = ACT_CheckEverything.call(this, _id)(checker);

    return ActionService.linkDocument({ _id, ...args }, { doc, action });
  }
});

export const unlinkDocument = new Method({
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

  run({ _id, documentId, documentType }) {
    ACT_CheckEverything.call(this, _id)(action => !action.isLinkedToDocument(documentId, documentType), ACT_NOT_LINKED);

    return ActionService.unlinkDocument({ _id, documentId, documentType });
  }
});

export const complete = new Method({
  name: 'Actions.complete',

  validate: CompleteActionSchema.validator(),

  run({ _id, ...args }) {
    const userId = this.userId;
    const checker = curry(ACT_OnCompleteChecker)({ userId });

    ACT_CheckEverything.call(this, _id)(checker);

    return ActionService.complete({ _id, userId, ...args });
  }
});

export const undoCompletion = new Method({
  name: 'Actions.undoCompletion',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    const checker = curry(ACT_OnUndoCompletionChecker)({ userId });

    ACT_CheckEverything.call(this, _id)(checker);

    return ActionService.undoCompletion({ _id, userId });
  }
});

export const verify = new Method({
  name: 'Actions.verify',

  validate: new SimpleSchema([
    IdSchema,
    {
      success: { type: Boolean },
      verificationComments: { type: String }
    }
  ]).validator(),

  run({ _id, ...args }) {
    const userId = this.userId;
    const checker = curry(ACT_OnVerifyChecker)({ userId });

    ACT_CheckEverything.call(this, _id)(checker);

    return ActionService.verify({ _id, userId, ...args });
  }
});

export const undoVerification = new Method({
  name: 'Actions.undoVerification',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    const checker = curry(ACT_OnUndoVerificationChecker)({ userId });

    const { action } = ACT_CheckEverything.call(this, _id)(checker);

    return ActionService.undoVerification({ _id, userId }, { action });
  }
});

export const remove = new Method({
  name: 'Actions.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    const checker = curry(ACT_OnRemoveChecker)({ userId });

    ACT_CheckEverything.call(this, _id)(checker);

    return ActionService.remove({ _id, deletedBy: userId });
  }
});

export const restore = new Method({
  name: 'Actions.restore',

  validate: IdSchema.validator(),

  run({ _id }) {
    const checker = curry(ACT_OnRestoreChecker)({ userId });

    ACT_CheckEverything.call(this, _id)(checker);

    return ActionService.restore({ _id });
  }
});
