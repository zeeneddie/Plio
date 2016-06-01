import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import RisksSectionService from './risks-section-service.js';
import { RisksSectionSchema } from './risks-section-schema.js';
import { RisksSections } from './risks-sections.js';

export const insert = new ValidatedMethod({
  name: 'Risks.insert',

  validate: RisksSchema.validator(),

  run({ ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create a standard'
      );
    }

    return RisksService.insert({ ...args });
  }
});
