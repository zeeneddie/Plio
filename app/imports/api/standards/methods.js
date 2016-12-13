import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import StandardsService from './standards-service.js';
import { StandardsSchema, StandardsUpdateSchema } from '/imports/share/schemas/standards-schema.js';
import { Standards } from '/imports/share/collections/standards.js';
import StandardsNotificationsSender from './standards-notifications-sender.js';
import {
  IdSchema,
  optionsSchema,
  StandardIdSchema,
  UserIdSchema,
} from '/imports/share/schemas/schemas.js';
import {
  checkOrgMembership,
  onRemoveChecker,
  onRestoreChecker,
  S_EnsureCanChange,
  S_EnsureCanChangeChecker,
} from '../checkers.js';
import { chain, chainCheckers, inject } from '/imports/api/helpers.js';
import Method, { CheckedMethod } from '../method.js';
import { UNIQUE_FIELD_MONGO_ERROR_CODE } from '/imports/api/constants.js';

const injectSTD = inject(Standards);

export const insert = new Method({
  name: 'Standards.insert',

  validate: StandardsSchema.validator(),

  run({ organizationId, ...args }) {
    chain(checkOrgMembership, S_EnsureCanChange)(this.userId, organizationId);

    return StandardsService.insert({ organizationId, ...args });
  },
});

export const update = new CheckedMethod({
  name: 'Standards.update',

  validate: new SimpleSchema([
    IdSchema, StandardsUpdateSchema, optionsSchema, optionsSchema,
  ]).validator(),

  check: checker => injectSTD(checker)(S_EnsureCanChangeChecker),

  run({ ...args }) {
    try {
      return StandardsService.update({ ...args });
    } catch (e) {
      if (e.code === UNIQUE_FIELD_MONGO_ERROR_CODE) {
        throw new Meteor.Error(
          'unique-field-error',
          'Unique field save error. Please check field with "unique" label'
        );
      }

      throw e;
    }
  },
});

export const updateViewedBy = new CheckedMethod({
  name: 'Standards.updateViewedBy',

  validate: IdSchema.validator(),

  check: checker => injectSTD(checker)(S_EnsureCanChangeChecker),

  run({ _id }) {
    return StandardsService.updateViewedBy({ _id, userId: this.userId });
  },
});

export const remove = new CheckedMethod({
  name: 'Standards.remove',

  validate: IdSchema.validator(),

  check: checker => injectSTD(checker)(chainCheckers(S_EnsureCanChangeChecker, onRemoveChecker)),

  run({ _id }) {
    return StandardsService.remove({ _id, deletedBy: this.userId });
  },
});

export const restore = new CheckedMethod({
  name: 'Standards.restore',

  validate: IdSchema.validator(),

  check: checker => injectSTD(checker)(chainCheckers(S_EnsureCanChangeChecker, onRestoreChecker)),

  run({ _id }) {
    return StandardsService.restore({ _id });
  },
});

export const addedToNotifyList = new Method({
  name: 'Standards.addedToNotifyList',

  validate: new SimpleSchema([
    StandardIdSchema,
    UserIdSchema,
  ]).validator(),

  check: checker => injectSTD(checker)(S_EnsureCanChangeChecker),

  run({ standardId, userId }) {
    if (this.isSimulation) {
      return undefined;
    }

    if (userId !== this.userId) {
      return new StandardsNotificationsSender(standardId).addedToNotifyList(userId);
    }

    return undefined;
  },
});
