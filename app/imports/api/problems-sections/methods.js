import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import ProblemsSectionService from './problems-section-service.js';
import { ProblemsSectionSchema } from './problems-section-schema.js';
import { ProblemsSections } from './risks-sections.js';

export const insert = new ValidatedMethod({
  name: 'ProblemsSections.insert',

  validate: ProblemsSectionSchema.validator(),

  run({ ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create a problems section'
      );
    }

    return ProblemsSectionService.insert({ ...args });
  }
});
