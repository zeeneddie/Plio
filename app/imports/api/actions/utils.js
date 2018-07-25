import {
  getCursorNonDeleted,
  toObjFind,
  makeOptionsFields,
} from '../helpers';
import { Actions, Files, Risks, NonConformities } from '../../share/collections';
import { getLinkedProblems } from '../problems/utils';
import { ProblemTypes } from '../../share/constants';

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
        ProblemTypes.POTENTIAL_GAIN,
        getLinkedProblemsOptions(NonConformities.publicFields),
      ),
      getLinkedProblems(
        ProblemTypes.RISK,
        getLinkedProblemsOptions(Risks.publicFields),
      ),
    ].map(toObjFind),
  };
};
