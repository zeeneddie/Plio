import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import LessonsService from './lessons-service.js';
import { LessonsSchema } from './lessons-schema.js';
import { Lessons } from './lessons.js';
import { IdSchema } from '../schemas.js';

export const insert = new ValidatedMethod({
  name: 'Lessons.insert',

  validate: LessonsSchema.validator(),

  run(...args) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot create a standard');
    }

    return LessonsService.insert(...args);
  }
});

export const update = new ValidatedMethod({
  name: 'Lessons.update',

  validate: new SimpleSchema([IdSchema, LessonsSchema]).validator(),

  run({_id, ...args}) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot create a standard');
    }

    return LessonsService.update({ _id, ...args });
  }
});

export const remove = new ValidatedMethod({
  name: 'Lessons.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot create a standard');
    }

    return LessonsService.remove({ _id });
  }
});
