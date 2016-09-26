import NCAuditConfig from './nc-audit-config.js';


export const getLogData = function(args) {
  const { newDoc, oldDoc } = args;
  const { nonConformityId } = newDoc || oldDoc;

  return {
    collection: NCAuditConfig.collectionName,
    documentId: nonConformityId
  };
};
