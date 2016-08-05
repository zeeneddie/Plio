import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import WorkItemService from './work-item-service.js';
import { WorkItemsSchema } from './work-item-schema.js';
import { WorkItems } from './work-items.js';
import { IdSchema } from '../schemas.js';

export const updateViewedBy = new ValidatedMethod({
  name: 'WorkItems.updateViewedBy',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update actions'
      );
    }

    return WorkItemService.updateViewedBy({ _id, viewedBy: userId });
  }
});

export const remove = new ValidatedMethod({
  name: 'WorkItems.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove a work item'
      );
    }

    return WorkItemService.remove({ _id, deletedBy: userId });
  }
});

export const restore = new ValidatedMethod({
  name: 'WorkItems.restore',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot restore a work item'
      );
    }

    return WorkItemService.restore({ _id });
  }
});
