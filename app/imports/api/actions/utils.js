import { getCursorOfNonDeletedWithFields } from '../helpers';
import { Actions } from './actions';

export const getActionsCursorByLinkedDoc = (fields) => ({ _id }) =>
  getCursorOfNonDeletedWithFields({ 'linkedTo.documentId': _id }, fields, Actions);

export const getActionsWithLimitedFields = (query) => {
  const fields = {
    organizationId: 1,
    title: 1,
    sequentialId: 1,
    type: 1,
    linkedTo: 1
  };

  return getCursorOfNonDeletedWithFields(query, fields, Actions);
};
