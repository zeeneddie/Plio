import {
  getCursorNonDeleted,
  toObjFind,
  makeOptionsFields
} from '../helpers';
import { Actions } from '/imports/share/collections/actions';
import { Files } from '/imports/share/collections/files';
import { getLinkedProblems } from '../problems/utils';
import { ProblemTypes } from '/imports/share/constants';
import {
  NonConformitiesListProjection,
  RisksListProjection
} from '../constants';

const extendWithWorkflow = fields =>
  makeOptionsFields(({ ...fields, workflowType: 1 }));

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

export const getActionFiles = ({ fileIds = [] }) =>
  Files.find({ _id: { $in: fileIds } });

export const createActionCardPublicationTree = (getQuery) => {
  return {
    find(...args) {
      return Actions.find(getQuery(...args));
    },
    children: [
      getActionFiles,
      getLinkedProblems(ProblemTypes.NON_CONFORMITY, extendWithWorkflow(NonConformitiesListProjection)),
      getLinkedProblems(ProblemTypes.RISK, extendWithWorkflow(RisksListProjection))
    ].map(toObjFind)
  };
};
