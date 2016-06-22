import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import ActionService from './action-service.js';
import { ActionSchema, RequiredSchema } from './action-schema.js';
import { Actions } from './actions.js';
import { IdSchema, optionsSchema } from '../schemas.js';


export const insert = new ValidatedMethod({
  name: 'Actions.insert',

  validate: RequiredSchema.validator(),

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
    const validationContext = new SimpleSchema([
      IdSchema, ActionSchema, optionsSchema
    ]).newContext();

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
