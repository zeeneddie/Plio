import { NonConformities } from '/imports/share/collections/non-conformities';
import { Files } from '/imports/share/collections/files';
import { createProblemsTree } from '../problems/utils';
import { getLessonsCursorByDocumentId } from '../lessons/utils';
import { getStandardsCursorByIds } from '../standards/utils';
import { toObjFind } from '../helpers';

export const getNCOtherFiles = ({
  fileIds = [],
  improvementPlan: {
    fileIds:IPFileIds = []
  } = {},
  rootCauseAnalysis: {
    fileIds:RCAFileIds = []
  } = {}
}) => {
  const ids = fileIds.concat(IPFileIds).concat(RCAFileIds);

  return Files.find({ _id: { $in: ids } });
};

export const createNonConformityCardPublicationTree = (getQuery) => {
  const tree = createProblemsTree((...args) => NonConformities.find(getQuery(...args)));

  const cursorGetters = [
    getNCOtherFiles,
    getLessonsCursorByDocumentId,
    getStandardsCursorByIds({ title: 1 }),
    ({ _id: nonConformityId }) => Occurrences.find({ nonConformityId }),
  ];

  const publishTree = Object.assign({}, tree, {
    children: [
      ...tree.children,
      ...cursorGetters.map(toObjFind)
    ]
  });

  return publishTree;
};
