import NCAuditConfig from '../non-conformities/nc-audit-config';


export const getLogData = function (args) {
  const { newDoc, oldDoc } = args;
  const { nonConformityId } = newDoc || oldDoc;

  return {
    collection: NCAuditConfig.collectionName,
    documentId: nonConformityId,
  };
};
