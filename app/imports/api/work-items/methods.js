import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { CheckedMethod } from '../method.js';
import WorkItemService from './work-item-service.js';
import { WorkItemsSchema } from './work-item-schema.js';
import { WorkItems } from './work-items.js';
import { IdSchema } from '../schemas.js';
import { WI_OnRestoreChecker } from '../checkers.js';

const wi = fn => fn(WorkItems);

export const updateViewedBy = new CheckedMethod({
  name: 'WorkItems.updateViewedBy',

  validate: IdSchema.validator(),

  check: checker => wi(checker),

  run({ _id }) {
    return WorkItemService.updateViewedBy({ _id, viewedBy: this.userId });
  }
});

export const remove = new CheckedMethod({
  name: 'WorkItems.remove',

  validate: IdSchema.validator(),

  check: checker => wi(checker),

  run({ _id }) {
    return WorkItemService.remove({ _id, deletedBy: this.userId });
  }
});

export const restore = new CheckedMethod({
  name: 'WorkItems.restore',

  validate: IdSchema.validator(),

  check: checker => wi(checker)(WI_OnRestoreChecker),

  run({ _id }) {
    return WorkItemService.restore({ _id });
  }
});
