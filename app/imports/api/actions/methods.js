import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import ActionService from './action-service.js';
import { ActionSchema, RequiredSchema } from './action-schema.js';
import { Actions } from './actions.js';
import { IdSchema, optionsSchema, StandardIdSchema } from '../schemas.js';
import { ProblemTypes } from '../constants.js';


export const insert = new ValidatedMethod({
  name: 'Actions.insert',

  validate(doc) {
    RequiredSchema.clean(doc, {
      removeEmptyStrings: true
    });

    return RequiredSchema.validator()(doc);
  },

  run({ ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create an action'
      );
    }

    return ActionService.insert({ ...args });
  }
});

export const update = new ValidatedMethod({
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

  run({ _id, options, query, ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update an action'
      );
    }

    return ActionService.update({ _id, options, query, ...args });
  }
});

export const updateViewedBy = new ValidatedMethod({
  name: 'Actions.updateViewedBy',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update actions'
      );
    }

    if (!Actions.findOne({ _id })) {
      throw new Meteor.Error(
        400, 'Action does not exist'
      );
    }

    if (!!Actions.findOne({ _id, viewedBy: this.userId })) {
      throw new Meteor.Error(
        400, 'You have been already added to the viewedBy list of this action'
      );
    }

    return ActionService.updateViewedBy({ _id, userId });
  }
});

export const setCompletionDate = new ValidatedMethod({
  name: 'Actions.setCompletionDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      targetDate: { type: Date }
    }
  ]).validator(),

  run({ _id, ...args }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot set target date for action completion'
      );
    }

    return ActionService.setCompletionDate({ _id, ...args });
  }
});

export const setVerificationDate = new ValidatedMethod({
  name: 'Actions.setVerificationDate',

  validate: new SimpleSchema([
    IdSchema,
    {
      targetDate: { type: Date }
    }
  ]).validator(),

  run({ _id, ...args }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot set target date for action verification'
      );
    }

    return ActionService.setVerificationDate({ _id, ...args });
  }
});

export const linkDocument = new ValidatedMethod({
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

  run({ ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot link actions to documents'
      );
    }

    return ActionService.linkDocument({ ...args });
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

  validate: new SimpleSchema([
    IdSchema,
    {
      completionComments: { type: String }
    }
  ]).validator(),

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
