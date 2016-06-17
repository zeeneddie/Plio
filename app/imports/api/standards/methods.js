import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import StandardsService from './standards-service.js';
import { StandardsSchema, StandardsUpdateSchema } from './standards-schema.js';
import { Standards } from './standards.js';
import StandardsNotificationsSender from './standards-notifications-sender.js';
import {
  IdSchema,
  OrganizationIdSchema,
  optionsSchema,
  StandardIdSchema,
  UserIdSchema
} from '../schemas.js';
import { UserRoles } from '../constants';
import { canChangeStandards } from '../checkers.js';


const ensureCanChangeStandards = (userId, organizationId) => {
  if (!canChangeStandards(userId, organizationId)) {
    throw new Meteor.Error(
      403,
      'You are not authorized for creating, removing or editing standards'
    );
  }
};

const getStandardOrThrow = (_id) => {
  const standard = Standards.findOne({ _id });
  if (!standard) {
    throw new Meteor.Error(400, 'Standard does not exist');
  }
  return standard;
};

export const insert = new ValidatedMethod({
  name: 'Standards.insert',

  validate: StandardsSchema.validator(),

  run({ organizationId, ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create a standard'
      );
    }

    ensureCanChangeStandards(userId, organizationId);

    return StandardsService.insert({ organizationId, ...args });
  }
});

export const update = new ValidatedMethod({
  name: 'Standards.update',

  validate: new SimpleSchema([
    IdSchema, StandardsUpdateSchema, optionsSchema
  ]).validator(),

  run({ _id, ...args }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a standard'
      );
    }

    const standard = getStandardOrThrow(_id);

    const { organizationId } = standard;

    ensureCanChangeStandards(userId, organizationId);

    return StandardsService.update({ _id, ...args });
  }
});

export const updateViewedBy = new ValidatedMethod({
  name: 'Standards.updateViewedBy',

  validate: IdSchema.validator(),

  run({ _id }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a standard'
      );
    }

    const standard = getStandardOrThrow(_id);

    const { viewedBy } = standard;

    if (viewedBy && viewedBy === this.userId) {
      throw new Meteor.Error(
        400, 'You have been already added to this list'
      );
    }

    return StandardsService.updateViewedBy({ _id, userId: this.userId });
  }
});

export const remove = new ValidatedMethod({
  name: 'Standards.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot delete a standard'
      );
    }

    const standard = getStandardOrThrow(_id);

    const { organizationId, isDeleted } = standard;

    ensureCanChangeStandards(userId, organizationId);

    return StandardsService.remove({ _id, isDeleted, deletedBy: userId });
  }
});

export const addedToNotifyList = new ValidatedMethod({
  name: 'Standards.addedToNotifyList',

  validate: new SimpleSchema([
    StandardIdSchema,
    UserIdSchema
  ]).validator(),

  run({ standardId, userId }) {
    if (this.isSimulation) {
      return;
    }

    const currUserId = this.userId;
    if (!currUserId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot send emails'
      );
    }

    const standard = getStandardOrThrow(standardId);
    ensureCanChangeStandards(currUserId, standard.organizationId);

    return new StandardsNotificationsSender(standardId).addedToNotifyList(userId);
  }
});
