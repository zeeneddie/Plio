import { onRestoreChecker } from '../checkers.js';
import { WorkItems } from './work-items.js';
import { WI_CANNOT_RESTORE_ASSIGNED_TO_OTHER } from '../errors.js';
import { checkAndThrow } from '../helpers.js';

export const WI_OnRestoreChecker = ({ ...args }, workItem) => {
  onRestoreChecker({ ...args}, workItem);

  const { type, linkedDoc, _id } = workItem;

  // do not allow users to restore deleted items if there is the same not deleted item but assigned to another user
  return (() => {
    const query = {
      type,
      linkedDoc,
      _id: { $ne: _id }
    };

    const doc = WorkItems.findOne(query);

    checkAndThrow(doc, WI_CANNOT_RESTORE_ASSIGNED_TO_OTHER);

    return { workItem, doc };
  })();
};
