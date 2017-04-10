import { CheckedMethod } from '../method';
import WorkItemService from '/imports/share/services/work-item-service';
import { WorkItems } from '/imports/share/collections/work-items';
import { IdSchema } from '/imports/share/schemas/schemas';
import { inject, always, T } from '/imports/api/helpers';

const injectWI = inject(WorkItems);

export const updateViewedBy = new CheckedMethod({
  name: 'WorkItems.updateViewedBy',

  validate: IdSchema.validator(),

  check: checker => injectWI(checker)(always(T)),

  run({ _id }) {
    return WorkItemService.updateViewedBy({ _id, viewedBy: this.userId });
  },
});
