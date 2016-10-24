import { Risks } from '/imports/share/collections/risks';
import { RiskTypes } from '/imports/share/collections/risk-types';
import { Files } from '/imports/share/collections/files';
import { createProblemsTree } from '../problems/utils';
import { getLessonsCursorByDocumentId } from '../lessons/utils';
import { getStandardsCursorByIds } from '../standards/utils';
import { toObjFind } from '../helpers';

export const getRiskFiles = ({
  fileIds = [],
  improvementPlan: {
    fileIds: IPFileIds = []
  } = {}
}) => {
  const ids = fileIds.concat(IPFileIds);

  return Files.find({ _id: { $in: ids } });
};

export const createRiskCardPublicationTree = (getQuery) => {
  const tree = createProblemsTree((...args) => Risks.find(getQuery(...args)));
  const cursorGetters = [
    getRiskFiles,
    getLessonsCursorByDocumentId,
    getStandardsCursorByIds({ title: 1 }),
    (({ typeId }) => RiskTypes.find({ _id: typeId }))
  ];

  const publishTree = Object.assign({}, tree, {
    children: [
      ...tree.children,
      ...cursorGetters.map(toObjFind)
    ]
  });

  return publishTree;
};
