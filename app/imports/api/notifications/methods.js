import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import NotificationsService from './notifications-service.js';
import { Notifications } from './notifications.js';
import { RequiredSchema } from './notifications-schema.js';
import { IdSchema } from '../schemas.js';

export const updateViewedBy = new ValidatedMethod({
  name: 'Notifications.updateViewedBy',

  validate(_id) { IdSchema.validator() },

  run(_id) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update notifications'
      );
    }

    if (!Notifications.findOne({ _id, recipientIds: this.userId })) {
      throw new Meteor.Error(
        400, 'Notification does not exist'
      );
    }

    if (!!Notifications.findOne({ _id, viewedBy: this.userId })) {
      throw new Meteor.Error(
        400, 'You have been already added to the viewedBy list of this notification'
      );
    }

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
