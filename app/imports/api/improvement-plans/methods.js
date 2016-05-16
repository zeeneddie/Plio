import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import ImprovementPlansService from './improvement-plans-service.js';
import { requiredSchema, optionalSchema, ImprovementPlansSchema } from './improvement-plans-schema.js';
import { ImprovementPlans } from './improvement-plans.js';
import { IdSchema, optionsSchema } from '../schemas.js';

export const insert = new ValidatedMethod({
  name: 'ImprovementPlans.insert',

  validate: ImprovementPlansSchema.validator(),

  run({ ...args }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot create an improvement plan');
    }

    return ImprovementPlansService.insert({ ...args });
  }
});

export const update = new ValidatedMethod({
  name: 'ImprovementPlans.update',

  validate: new SimpleSchema([IdSchema, optionalSchema, optionsSchema]).validator(),

  run({ _id, ...args }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot update an improvement plan');
    }

    return ImprovementPlansService.update({ _id, ...args });
  }
});
