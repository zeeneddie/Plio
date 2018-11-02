import { contains } from 'ramda';

import { CustomerElementTypes } from '../../../share/constants';
import { getLinkedDoc, getLinkedDocAuditConfig } from '../../utils/helpers';
import { getReceivers } from '../customer-elements/helpers';

export const isCustomerElement = ({ documentType }) =>
  contains(documentType, Object.values(CustomerElementTypes));

export const getCustomerElementData = ({ rel1, rel2 }) => {
  const doc1 = getLinkedDoc(rel1.documentId, rel1.documentType);
  const doc2 = getLinkedDoc(rel2.documentId, rel2.documentType);
  const rel1AuditConfig = getLinkedDocAuditConfig(rel1.documentType);
  const rel2AuditConfig = getLinkedDocAuditConfig(rel2.documentType);
  const rel1Name = rel1AuditConfig.docName(doc1);
  const rel1Desc = rel1AuditConfig.docDescription(doc1);
  const rel2Name = rel2AuditConfig.docName(doc2);
  const rel2Desc = rel2AuditConfig.docDescription(doc2);
  // WARN: Careful! Things will break if customer elements
  // could be linked to multiple canvas documents
  const { linkedTo: [rel1LinkedTo] } = doc1;
  const { linkedTo: [rel2LinkedTo] } = doc2;
  const rel1LinkedDoc = getLinkedDoc(rel1LinkedTo.documentId, rel1LinkedTo.documentType);
  const rel2LinkedDoc = getLinkedDoc(rel2LinkedTo.documentId, rel2LinkedTo.documentType);
  const rel1LinkedDocAuditConfig = getLinkedDocAuditConfig(rel1LinkedTo.documentType);
  const rel2LinkedDocAuditConfig = getLinkedDocAuditConfig(rel2LinkedTo.documentType);
  const rel1LinkedDocName = rel1LinkedDocAuditConfig.docName(rel1LinkedDoc);
  const rel1LinkedDocDesc = rel1LinkedDocAuditConfig.docDescription(rel1LinkedDoc);
  const rel2LinkedDocName = rel2LinkedDocAuditConfig.docName(rel2LinkedDoc);
  const rel2LinkedDocDesc = rel2LinkedDocAuditConfig.docDescription(rel2LinkedDoc);

  return {
    rel1Name,
    rel1Desc,
    rel2Name,
    rel2Desc,
    rel1LinkedDocDesc,
    rel2LinkedDocDesc,
    rel1LinkedDocName,
    rel2LinkedDocName,
  };
};

export const getCustomerElementReceivers = ({ rel1: { documentId, documentType } }, user) => {
  const doc = getLinkedDoc(documentId, documentType);
  return getReceivers(doc, user);
};
