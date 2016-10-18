import { Standards } from '/imports/share/collections/standards.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Risks } from '/imports/share/collections/risks.js';
import { ProblemTypes } from '/imports/share/constants.js';
import { getCollectionByDocType } from '/imports/share/helpers.js';
import { getUserId } from '../../utils/helpers.js';
import NCAuditConfig from '../non-conformities/nc-audit-config.js';
import RiskAuditConfig from '../risks/risk-audit-config.js';


export const getReceivers = ({ linkedTo, ownerId }, user) => {
  const getLinkedDocsIds = (linkedDocs, docType) => {
    return _.pluck(
      _.filter(linkedDocs, ({ documentType }) => documentType === docType),
      'documentId'
    );
  };

  const usersIds = new Set([ownerId]);
  const standardsIds = new Set();

  const getIds = (collection, problemType) => {
    const query = {
      _id: { $in: getLinkedDocsIds(linkedTo, problemType) }
    };

    collection.find(query).forEach((doc) => {
      _(doc.standardsIds).each(id => standardsIds.add(id));
      usersIds.add(doc.identifiedBy);
    });
  };

  _.each(
    [
      { collection: NonConformities, type: ProblemTypes.NON_CONFORMITY },
      { collection: Risks, type: ProblemTypes.RISK }
    ],
    ({ collection, type }) => getIds(collection, type)
  );

  Standards.find({
    _id: { $in: Array.from(standardsIds) }
  }).forEach(({ owner }) => usersIds.add(owner));

  const receivers = Array.from(usersIds);

  const userId = getUserId(user);
  const index = receivers.indexOf(userId);
  (index > -1) && receivers.splice(index, 1);

  return receivers;
};

export const getLinkedDocAuditConfig = (documentType) => {
  return {
    [ProblemTypes.NON_CONFORMITY]: NCAuditConfig,
    [ProblemTypes.RISK]: RiskAuditConfig
  }[documentType];
};

export const getLinkedDocName = (documentId, documentType) => {
  const collection = getCollectionByDocType(documentType);
  const doc = collection.findOne({ _id: documentId });
  const docAuditConfig = getLinkedDocAuditConfig(documentType);

  return docAuditConfig.docDescription(doc);
};
