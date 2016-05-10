import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import LessonsService from './lessons-service.js';
import { LessonsSchema } from './lessons-schema.js';
import { Lessons } from './lessons.js';
import { checkUserId } from '../checkers.js';
import { IdSchema } from '../schemas.js';

export const insert = new ValidatedMethod({
  name: 'Lessons.insert',

  validate: LessonsSchema.validator(),

  run(...args) {
    checkUserId(
      this.userId,
      'Unauthorized user cannot create a standard'
    );

    return LessonsService.insert(...args);
  }
});

export const update = new ValidatedMethod({
  name: 'Lessons.update',

  validate: LessonsSchema.validator(),

  run({_id, options, ...args}) {
    checkUserId(
      this.userId,
      'Unauthorized user cannot update a standard'
    );

    return LessonsService.update({ _id, options, ...args });
  }
});

export const remove = new ValidatedMethod({
  name: 'Standards.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    checkUserId(
      this.userId,
      'Unauthorized user cannot delete a standard'
    );

    return StandardsService.remove({ _id });
  }
});
