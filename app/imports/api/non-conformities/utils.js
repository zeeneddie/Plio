import { NonConformities } from '/imports/share/collections/non-conformities';
import { Files } from '/imports/share/collections/files';
import { Occurrences } from '/imports/share/collections/occurrences';
import { createProblemsTree } from '../problems/utils';
import { getLessonsCursorByDocumentId } from '../lessons/utils';
import { getStandardsCursorByIds } from '../standards/utils';
import { toObjFind, compose, assoc, transsoc, mapC, propId } from '../helpers';

export const getNCOtherFiles = ({
  fileIds = [],
  improvementPlan: {
    fileIds: IPFileIds = [],
  } = {},
  rootCauseAnalysis: {
    fileIds: RCAFileIds = [],
  } = {},
}) => {
  const ids = fileIds.concat(IPFileIds).concat(RCAFileIds);

  return Files.find({ _id: { $in: ids } });
};

// compose(
//   Files.find.bind(Files),
//   ids => ({ _id: { $in: ids } }),
//   Object.values,
//   pickC(['fileIds', 'improvementPlan.fileIds', 'rootCauseAnalysis.fileIds']),
// );

export const createNonConformityCardPublicationTree = (getQuery) => {
  const findNCs = compose(NonConformities.find.bind(NonConformities), getQuery);
  const tree = createProblemsTree(findNCs);
  const cursorGetters = [
    getNCOtherFiles,
    getLessonsCursorByDocumentId,
    getStandardsCursorByIds({ title: 1 }),
    compose(Occurrences.find.bind(Occurrences), transsoc({ nonConformityId: propId })),
  ];
  const children = [...tree.children, ...mapC(toObjFind, cursorGetters)];
  const publishTree = assoc('children', children, tree);

  return publishTree;
};
