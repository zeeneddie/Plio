import curry from 'lodash.curry';
import property from 'lodash.property';
import { getCursorNonDeleted } from '../helpers';
import { getActionsCursorByLinkedDoc } from '../actions/utils';
import { getWorkItemsCursorByIdsWithLimitedFields } from '../work-items/utils';
import { getCollectionByDocType } from '/imports/share/helpers';

export const getProblemsByStandardIds = collection => ({ _id: standardsIds }) =>
  getCursorNonDeleted({ standardsIds }, {}, collection);

export const createProblemsTree = getInitial => ({
  find: getInitial,
  children: [
    {
      find: getActionsCursorByLinkedDoc({}),
      children: [
        {
          find: getWorkItemsCursorByIdsWithLimitedFields,
        },
      ],
    },
    {
      find: getWorkItemsCursorByIdsWithLimitedFields,
    },
  ],
});

export const getProblemsWithLimitedFields = curry((query, collection) => {
  const fields = {
    organizationId: 1,
    title: 1,
    sequentialId: 1,
    standardsIds: 1,
  };

  return getCursorNonDeleted(query, fields, collection);
});

export const getLinkedProblems = curry((documentType, options, { organizationId, linkedTo }) => {
  const ids = _.map(_.where(linkedTo, { documentType }), property('documentId'));
  const collection = getCollectionByDocType(documentType);
  const query = {
    organizationId,
    _id: {
      $in: ids,
    },
  };

  return collection.find(query, options);
});
