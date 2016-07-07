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
        403, 'Unauthorized user cannot update an action'
      );
    }

    return ActionService.updateViewedBy({ _id, userId });
  }
});

export const linkProblem = new ValidatedMethod({
  name: 'Actions.linkProblem',

  validate: new SimpleSchema([
    IdSchema,
    {
      problemId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
      },
      problemType: {
        type: String,
        allowedValues: _.values(ProblemTypes)
      }
    }
  ]).validator(),

  run({ ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot link actions to problems'
      );
    }

    return ActionService.linkProblem({ ...args });
  }
});

export const unlinkProblem = new ValidatedMethod({
  name: 'Actions.unlinkProblem',

  validate: new SimpleSchema([
    IdSchema,
    {
      problemId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
      },
      problemType: {
        type: String,
        allowedValues: _.values(ProblemTypes)
      }
    }
  ]).validator(),

  run({ ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot link remove action\'s links to problems'
      );
    }

    return ActionService.unlinkProblem({ ...args });
  }
});

export const complete = new ValidatedMethod({
  name: 'Actions.complete',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot complete an action'
      );
    }

    return ActionService.complete({ _id, userId });
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

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot verify an action'
      );
    }

    return ActionService.verify({ _id, userId });
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

    return ActionService.remove({ _id, deletedBy: userId});
  }
});
