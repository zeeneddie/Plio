import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import StandardsBookSectionService from './standards-book-section-service.js';
import {
  StandardsBookSectionSchema
} from './standards-book-section-schema.js';
import { IdSchema, OrganizationIdSchema } from '../schemas.js';
import { UserRoles } from '../constants';


export const insert = new ValidatedMethod({
  name: 'StandardsBookSections.insert',

  validate: StandardsBookSectionSchema.validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create a standards book section'
      );
    }

    const { organizationId } = doc;
    const canEditOrgSettings = Roles.userIsInRole(this.userId, UserRoles.CHANGE_ORG_SETTINGS, organizationId);

    if (!canEditOrgSettings) {
      throw new Meteor.Error(
        403,
        'User is not authorized for editing organization settings'
      );
    }

    return StandardsBookSectionService.insert(doc);
  }
});

export const update = new ValidatedMethod({
  name: 'StandardsBookSections.update',

  validate: new SimpleSchema([
    IdSchema,
    StandardsBookSectionSchema
  ]).validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a standards book section'
      );
    }

    const { organizationId } = doc;
    const canEditOrgSettings = Roles.userIsInRole(this.userId, UserRoles.CHANGE_ORG_SETTINGS, organizationId);

    if (!canEditOrgSettings) {
      throw new Meteor.Error(
        403,
        'User is not authorized for editing organization settings'
      );
    }

    return StandardsBookSectionService.update(doc);
  }
});

export const remove = new ValidatedMethod({
  name: 'StandardsBookSections.remove',

  validate: new SimpleSchema([IdSchema, OrganizationIdSchema]).validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove a standards book section'
      );
    }

    const { organizationId } = doc;
    const canEditOrgSettings = Roles.userIsInRole(this.userId, UserRoles.CHANGE_ORG_SETTINGS, organizationId);

    if (!canEditOrgSettings) {
      throw new Meteor.Error(
        403,
        'User is not authorized for editing organization settings'
      );
    }

    return StandardsBookSectionService.remove(doc);
  }
});
