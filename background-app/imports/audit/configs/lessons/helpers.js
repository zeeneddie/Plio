import { getCollectionNameByDocType } from '/imports/share/helpers';


export const getLogData = function (args) {
  const { newDoc, oldDoc } = args;
  const { documentId, documentType } = newDoc || oldDoc;

  return {
    collection: getCollectionNameByDocType(documentType),
    documentId,
  };
};
