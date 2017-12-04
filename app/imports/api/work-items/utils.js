import { getCursorNonDeleted } from '../helpers';
import { WorkItems } from '/imports/share/collections/work-items';

export const getWorkItemsCursorByIds = fields => ({ _id } = {}) =>
  getCursorNonDeleted({ 'linkedDoc._id': _id }, fields, WorkItems);

export const getWorkItemsCursorByIdsWithLimitedFields =
  getWorkItemsCursorByIds({
    linkedDoc: 1,
    isCompleted: 1,
    assigneeId: 1,
    organizationId: 1,
  });
