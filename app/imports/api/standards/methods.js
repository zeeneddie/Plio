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

const getStandardOrThrow = (standardId) => {
  const standard = Standards.findOne({ _id: standardId });
  if (!standard) {
    throw new Meteor.Error(400, 'Standard does not exist');
  }
  return standard;
};

export const insert = new ValidatedMethod({
  name: 'Standards.insert',

  validate: StandardsSchema.validator(),

  run(...args) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create a standard'
      );
    }

    const [ doc ] = args;
    const { organizationId } = doc;

    ensureCanChangeStandards(userId, organizationId);

    return StandardsService.insert(...args);
  }
});

export const update = new ValidatedMethod({
  name: 'Standards.update',

  validate: new SimpleSchema([
    IdSchema, StandardsUpdateSchema, optionsSchema, OrganizationIdSchema
  ]).validator(),

  run({_id, options, ...args, organizationId }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a standard'
      );
    }

    ensureCanChangeStandards(userId, organizationId);

    getStandardOrThrow(_id);

    return StandardsService.update({ _id, options, ...args });
  }
});

export const updateViewedBy = new ValidatedMethod({
  name: 'Standards.updateViewedBy',

  validate: IdSchema.validator(),

  run({ _id }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot delete a standard'
      );
    }

    if (!!Standards.findOne({ _id, viewedBy: this.userId })) {
      throw new Meteor.Error(
        403,
        'You have been already added to this list'
      );
    }

    return StandardsService.updateViewedBy({ _id, userId: this.userId });
  }
});

export const remove = new ValidatedMethod({
  name: 'Standards.remove',

  validate: new SimpleSchema([
    IdSchema, OrganizationIdSchema
  ]).validator(),

  run({ _id, organizationId }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot delete a standard'
      );
    }

    ensureCanChangeStandards(userId, organizationId);

    getStandardOrThrow(_id);

    return StandardsService.remove({ _id, deletedBy: userId });
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
