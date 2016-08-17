import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import ActionService from './action-service.js';
import { ActionSchema, RequiredSchema } from './action-schema.js';
import { Actions } from './actions.js';
import { IdSchema, optionsSchema, StandardIdSchema, CompleteActionSchema } from '../schemas.js';
import { ProblemTypes } from '../constants.js';
import Method from '../method.js';
import {
  checkDocExistance,
  checkOrgMembership,
  checkOrgMembershipByDoc,
  ACT_OnLinkChecker
} from '../checkers.js';
import { chain, checkAndThrow } from '../helpers.js';
import {
  ACT_CANNOT_SET_TARGET_DATE_FOR_COMPLETED,
  ACT_CANNOT_SET_EXECUTOR_FOR_COMPLETED,
  ACT_CANNOT_SET_VERIFICATION_DATE_FOR_VERIFIED,
  ACT_CANNOT_SET_EXECUTOR_FOR_VERIFIED
} from '../errors.js';

const checkers = function checkers(_id) {
  return chain(checkDocExistance, checkOrgMembershipByDoc)(Actions, _id, this.userId);
};


export const insert = new Method({
  name: 'Actions.insert',

  validate(doc) {
    RequiredSchema.clean(doc, {
      removeEmptyStrings: true
    });

    return RequiredSchema.validator()(doc);
  },

  run({ organizationId, ...args }) {
    checkOrgMembership(this.userId, organizationId);

    return ActionService.insert({ organizationId, ...args });
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
    checkers.call(this, _id);

    return ActionService.update({ _id, ...args });
  }
});

export const updateViewedBy = new Method({
  name: 'Actions.updateViewedBy',

  validate: IdSchema.validator(),

  run({ _id }) {
    checkers.call(this, _id);

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
    const [doc] = checkers.call(this, _id);

    checkAndThrow(doc.completed(), ACT_CANNOT_SET_TARGET_DATE_FOR_COMPLETED);

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
    const [doc] = checkers.call(this, _id);

    checkAndThrow(doc.completed(), ACT_CANNOT_SET_EXECUTOR_FOR_COMPLETED);

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
    const [doc] = checkers.call(this, _id);

    checkAndThrow(doc.verified(), ACT_CANNOT_SET_VERIFICATION_DATE_FOR_VERIFIED);

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
    const [doc] = checkers.call(this, _id);

    checkAndThrow(doc.verified(), ACT_CANNOT_SET_EXECUTOR_FOR_VERIFIED);

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
    const [action] = checkers.call(this, _id);

    const { doc } = ACT_OnLinkChecker(action, { ...args });

    return ActionService.linkDocument({ _id, ...args }, { doc, action });
  }
});

export const unlinkDocument = new ValidatedMethod({
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

  run({ ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403,
        'Unauthorized user cannot link remove action\'s links to documents'
      );
    }

    return ActionService.unlinkDocument({ ...args });
  }
});

export const complete = new ValidatedMethod({
  name: 'Actions.complete',

  validate: CompleteActionSchema.validator(),

  run({ _id, ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot complete an action'
      );
    }

    return ActionService.complete({ _id, userId, ...args });
  }
});

export const undoCompletion = new ValidatedMethod({
  name: 'Actions.undoCompletion',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot undo an action'
      );
    }

    return ActionService.undoCompletion({ _id, userId });
  }
});

export const verify = new ValidatedMethod({
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
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot verify an action'
      );
    }

    return ActionService.verify({ _id, userId, ...args });
  }
});

export const undoVerification = new ValidatedMethod({
  name: 'Actions.undoVerification',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot undo an action'
      );
    }

    return ActionService.undoVerification({ _id, userId });
  }
});

export const remove = new ValidatedMethod({
  name: 'Actions.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove an action'
      );
    }

    return ActionService.remove({ _id, deletedBy: userId });
  }
});

export const restore = new ValidatedMethod({
  name: 'Actions.restore',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot restore an action'
      );
    }

    return ActionService.restore({ _id });
  }
});
