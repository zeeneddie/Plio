import { _ } from 'meteor/underscore';

import { Standards } from '/imports/share/collections/standards';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Risks } from '/imports/share/collections/risks';
import { ProblemTypes } from '/imports/share/constants';
import { getCollectionByDocType } from '/imports/share/helpers';
import { getUserId } from '../../utils/helpers';
import NCAuditConfig from '../non-conformities/nc-audit-config';
import RiskAuditConfig from '../risks/risk-audit-config';


export const getReceivers = ({ linkedTo, notify }, user) => {
  const getLinkedDocsIds = (linkedDocs, docType) => {
    return _.pluck(
      linkedDocs.filter(({ documentType }) => documentType === docType),
      'documentId'
    );
  };

  const usersIds = new Set(notify);
  const standardsIds = new Set();

  const getIds = (collection, problemType) => {
    const query = {
      _id: { $in: getLinkedDocsIds(linkedTo, problemType) },
    };

    collection.find(query).forEach((doc) => {
      doc.standardsIds.forEach(id => standardsIds.add(id));
      usersIds.add(doc.identifiedBy);
    });
  };

  const problemCollections = [
    { collection: NonConformities, type: ProblemTypes.NON_CONFORMITY },
    { collection: Risks, type: ProblemTypes.RISK },
  ];

  problemCollections.forEach(({ collection, type }) => getIds(collection, type));

  Standards.find({
    _id: { $in: Array.from(standardsIds) },
  }).forEach(({ owner }) => usersIds.add(owner));

  const receivers = Array.from(usersIds);

  const index = receivers.indexOf(getUserId(user));

  return index > -1
    ? receivers.slice(0, index).concat(receivers.slice(index + 1))
    : receivers;
};

export const getLinkedDocAuditConfig = (documentType) => {
  return {
    [ProblemTypes.NON_CONFORMITY]: NCAuditConfig,
    [ProblemTypes.RISK]: RiskAuditConfig,
  }[documentType];
};

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
