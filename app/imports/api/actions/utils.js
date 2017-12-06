import {
  getCursorNonDeleted,
  toObjFind,
  makeOptionsFields,
} from '../helpers';
import { Actions } from '/imports/share/collections/actions';
import { Files } from '/imports/share/collections/files';
import { Risks } from '/imports/share/collections/risks';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { getLinkedProblems } from '../problems/utils';
import { ProblemTypes } from '/imports/share/constants';

export const getActionsCursorByLinkedDoc = fields => ({ _id }) =>
  getCursorNonDeleted({ 'linkedTo.documentId': _id }, fields, Actions);

export const getActionsWithLimitedFields = (query) => {
  const fields = {
    organizationId: 1,
    title: 1,
    sequentialId: 1,
    type: 1,
    linkedTo: 1,
  };

  return getCursorNonDeleted(query, fields, Actions);
};

export const getActionFiles = ({ fileIds = [] }) =>
  Files.find({ _id: { $in: fileIds } });

export const createActionCardPublicationTree = (getQuery) => {
  const getLinkedProblemsOptions = fields =>
    makeOptionsFields({
      ...fields, workflowType: 1, status: 1, magnitude: 1,
    });
  return {
    find(...args) {
      return Actions.find(getQuery(...args));
    },
    children: [
      getActionFiles,
      getLinkedProblems(
        ProblemTypes.NON_CONFORMITY,
        getLinkedProblemsOptions(NonConformities.publicFields),
      ),
      getLinkedProblems(
        ProblemTypes.RISK,
        getLinkedProblemsOptions(Risks.publicFields),
      ),
    ].map(toObjFind),
  };
};
