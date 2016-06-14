import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import OccurencesService from './occurences-service.js';
import { RequiredSchema } from './occurences-schema.js';
import { Occurences } from './occurences.js';
import { NonConformities } from '../non-conformities/non-conformities.js';
import { IdSchema } from '../schemas.js';

export const insert = new ValidatedMethod({
  name: 'Occurences.insert',

  validate: RequiredSchema.validator(),

  run({ ...args, nonConformityId }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot create an occurence');
    }

    if (!NonConformities.findOne({ _id: nonConformityId })) {
      throw new Meteor.Error(403, 'Non-conformity with that ID does not exist');
    }

    return OccurencesService.insert({ ...args, nonConformityId });
  }
});

export const update = new ValidatedMethod({
  name: 'Occurences.update',

  validate: new SimpleSchema([IdSchema, {
    description: {
      type: String
    },
    date: {
      type: Date
    }
  }]).validator(),

  run({_id, ...args}) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot update an occurence');
    }

    return OccurencesService.update({ _id, ...args });
  }
});

export const remove = new ValidatedMethod({
  name: 'Occurences.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot remove an occurence');
    }

    return OccurencesService.remove({ _id });
  }
});
