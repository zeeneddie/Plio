import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import OrganizationService from './organization-service.js';
import { OrganizationFormSchema } from './organization-schema.js';


export const insert = new ValidatedMethod({
  name: 'Organizations.insert',

  validate: new SimpleSchema({
    name: { type: String }
  }).validator(),

  run({ name }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create an organization'
      );
    }

    return OrganizationService.insert({
      name,
      ownerId: userId
    });
  }
});

export const update = new ValidatedMethod({
  name: 'Organizations.update',

  validate: OrganizationFormSchema.validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update an organization'
      );
    }

    return OrganizationService.update(doc);
  }
});
