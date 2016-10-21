import { getCursorNonDeleted } from '../helpers';
import { Actions } from '/imports/share/collections/actions';

export const getActionsCursorByLinkedDoc = (fields) => ({ _id }) =>
  getCursorNonDeleted({ 'linkedTo.documentId': _id }, fields, Actions);

export const getActionsWithLimitedFields = (query) => {
  const fields = {
    organizationId: 1,
    title: 1,
    sequentialId: 1,
    type: 1,
    linkedTo: 1
  };

  return getCursorNonDeleted(query, fields, Actions);
};
