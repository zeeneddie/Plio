import { getCursorOfNonDeletedWithFields } from '../helpers';
import { getActionsCursorByLinkedDoc } from '../actions/utils';
import { getWorkItemsCursorByIdsWithLimitedFields } from '../work-items/utils';
import curry from 'lodash.curry';

export const getProblemsByStandardIds = collection => ({ _id: standardsIds }) =>
  getCursorOfNonDeletedWithFields({ standardsIds }, {}, collection);

export const createProblemsTree = (getInitial) => ({
  find: getInitial,
  children: [
    {
      find: getActionsCursorByLinkedDoc({}),
      children: [
        {
          find: getWorkItemsCursorByIdsWithLimitedFields
        }
      ]
    },
    {
      find: getWorkItemsCursorByIdsWithLimitedFields
    }
  ]
});

export const getProblemsWithLimitedFields = curry((query, collection) => {
  const fields = {
    organizationId: 1,
    title: 1,
    sequentialId: 1,
    standardsIds: 1
  };

  return getCursorOfNonDeletedWithFields(query, fields, collection);
});
