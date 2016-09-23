import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { CheckedMethod } from '../method.js';
import WorkItemService from './work-item-service.js';
import { WorkItemsSchema } from '/imports/share/schemas/work-item-schema.js';
import { WorkItems } from '/imports/share/collections/work-items.js';
import { IdSchema } from '/imports/share/schemas/schemas.js';
import { inject } from '/imports/share/helpers.js';
import { onRemoveChecker, WI_OnRestoreChecker } from '../checkers.js';

const injectWI = inject(WorkItems);

export const updateViewedBy = new CheckedMethod({
  name: 'WorkItems.updateViewedBy',

  validate: IdSchema.validator(),

  check: checker => injectWI(checker),

  run({ _id }) {
    return WorkItemService.updateViewedBy({ _id, viewedBy: this.userId });
  }
});

export const remove = new CheckedMethod({
  name: 'WorkItems.remove',

  validate: IdSchema.validator(),

  check: checker => injectWI(checker)(onRemoveChecker),

  run({ _id }) {
    return WorkItemService.remove({ _id, deletedBy: this.userId });
  }
});

export const restore = new CheckedMethod({
  name: 'WorkItems.restore',

  validate: IdSchema.validator(),

  check: checker => injectWI(checker)(WI_OnRestoreChecker),

  run({ _id }) {
    return WorkItemService.restore({ _id });
  }
});
