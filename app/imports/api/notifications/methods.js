import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import NotificationsService from './notifications-service.js';
import { Notifications } from './notifications.js';
import { RequiredSchema } from './notifications-schema.js';
import { IdSchema } from '../schemas.js';
import Method from '../method.js';
import { checkDocExistance } from '../checkers.js';

const { compose } = _;

export const updateViewedBy = new Method({
  name: 'Notifications.updateViewedBy',

  validate(_id) { IdSchema.validator() },

  check(checker) {
    return compose(checker, checkDocExistance)(Notifications, { recipientIds: this.userId });
  },

  run(_id) {
    return NotificationsService.updateViewedBy({ _id, userId: this.userId });
  }
});

export const insert = new ValidatedMethod({
  name: 'Notifications.insert',

  validate: RequiredSchema.validator(),

  run({ ...args }) {
    return NotificationsService.insert({ ...args });
  }
});
