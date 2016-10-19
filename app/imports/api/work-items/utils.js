import { getCursorOfNonDeletedWithFields } from '../helpers';
import { WorkItems } from '/imports/share/collections/work-items';

export const getWorkItemsCursorByIds = (fields) => ({ _id } = {}) =>
  getCursorOfNonDeletedWithFields({ 'linkedDoc._id': _id }, fields, WorkItems);

export const getWorkItemsCursorByIdsWithLimitedFields =
  getWorkItemsCursorByIds({
    linkedDoc: 1,
    isCompleted: 1,
    assigneeId: 1
  });
