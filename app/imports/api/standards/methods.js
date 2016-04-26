import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import StandardsService from './standards-service.js';
import { StandardsSchema } from './standards-schema.js';
import { Standards } from './standards.js';
import { checkUserId } from '../checkers.js';

export const insert = new ValidatedMethod({
  name: 'Standards.insert',

  validate: StandardsSchema.validator(),

  run(doc) {
    checkUserId(
      this.userId,
      'Unauthorized user can not create a standard'
    );

    return StandardsService.insert(doc);
  }
});
