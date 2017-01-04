import { _ } from 'meteor/underscore';

import { Standards } from '/imports/share/collections/standards';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Risks } from '/imports/share/collections/risks';
import { ProblemTypes } from '/imports/share/constants';
import { getCollectionByDocType } from '/imports/share/helpers';
import { getUserId } from '../../utils/helpers';
import NCAuditConfig from '../non-conformities/nc-audit-config';
import RiskAuditConfig from '../risks/risk-audit-config';


export const getReceivers = ({ linkedTo, ownerId }, user) => {
  const getLinkedDocsIds = (linkedDocs, docType) => (
    _.pluck(
      _.filter(linkedDocs, ({ documentType }) => documentType === docType),
      'documentId'
    )
  );

  const usersIds = new Set([ownerId]);
  const standardsIds = new Set();

  const getIds = (collection, problemType) => {
    const query = {
      _id: { $in: getLinkedDocsIds(linkedTo, problemType) },
    };

    collection.find(query).forEach((doc) => {
      _(doc.standardsIds).each(id => standardsIds.add(id));
      usersIds.add(doc.identifiedBy);
    });
  };

  _.each(
    [
      { collection: NonConformities, type: ProblemTypes.NON_CONFORMITY },
      { collection: Risks, type: ProblemTypes.RISK },
    ],
    ({ collection, type }) => getIds(collection, type)
  );

  Standards.find({
    _id: { $in: Array.from(standardsIds) },
  }).forEach(({ owner }) => usersIds.add(owner));

  const receivers = Array.from(usersIds);

  const userId = getUserId(user);
  const index = receivers.indexOf(userId);
  (index > -1) && receivers.splice(index, 1);

  return receivers;
};

export const getLinkedDocAuditConfig = (documentType) => ({
  [ProblemTypes.NON_CONFORMITY]: NCAuditConfig,
  [ProblemTypes.RISK]: RiskAuditConfig,
}[documentType]);

const getLinkedDoc = (documentId, documentType) => {
  const collection = getCollectionByDocType(documentType);
  return collection.findOne({ _id: documentId });
};

export const getLinkedDocDescription = (documentId, documentType) => {
  const doc = getLinkedDoc(documentId, documentType);
  const docAuditConfig = getLinkedDocAuditConfig(documentType);

  return docAuditConfig.docDescription(doc);
};

export const getLinkedDocName = (documentId, documentType) => {
  const doc = getLinkedDoc(documentId, documentType);
  const docAuditConfig = getLinkedDocAuditConfig(documentType);

  return docAuditConfig.docName(doc);
};
