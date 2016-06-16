import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import OccurrencesService from './occurrences-service.js';
import { RequiredSchema } from './occurrences-schema.js';
import { Occurrences } from './occurrences.js';
import { NonConformities } from '../non-conformities/non-conformities.js';
import { IdSchema } from '../schemas.js';

export const insert = new ValidatedMethod({
  name: 'Occurrences.insert',

  validate: RequiredSchema.validator(),

  run({ ...args, nonConformityId }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot create an occurence');
    }

    if (!NonConformities.findOne({ _id: nonConformityId })) {
      throw new Meteor.Error(400, 'Non-conformity with that ID does not exist');
    }

    return OccurrencesService.insert({ ...args, nonConformityId });
  }
});

export const update = new ValidatedMethod({
  name: 'Occurrences.update',

  validate(doc) {
    const validationContext = new SimpleSchema([IdSchema, {
      description: {
        type: String
      },
      date: {
        type: Date
      }
    }]).newContext();

    for (let key in doc) {
      if (!validationContext.validateOne(doc, key)) {
        const errors = validationContext.invalidKeys();
        const message = validationContext.keyErrorMessage(errors[0].name);
        throw new ValidationError(errors, message);
      }
    }
  },

  run({_id, ...args}) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot update an occurence');
    }

    return OccurrencesService.update({ _id, ...args });
  }
});

export const remove = new ValidatedMethod({
  name: 'Occurrences.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot remove an occurence');
    }

    return OccurrencesService.remove({ _id });
  }
});
