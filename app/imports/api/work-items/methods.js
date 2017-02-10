import { CheckedMethod } from '../method.js';
import WorkItemService from './work-item-service.js';
import { WorkItems } from '/imports/share/collections/work-items.js';
import { IdSchema } from '/imports/share/schemas/schemas.js';
import { inject } from '/imports/api/helpers.js';

const injectWI = inject(WorkItems);

export const updateViewedBy = new CheckedMethod({
  name: 'WorkItems.updateViewedBy',

  validate: IdSchema.validator(),

  check: checker => injectWI(checker),

  run({ _id }) {
    return WorkItemService.updateViewedBy({ _id, viewedBy: this.userId });
  },
});
