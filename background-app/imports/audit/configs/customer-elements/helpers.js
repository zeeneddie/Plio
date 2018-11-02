import { getNotifyReceivers, getLinkedDocAuditConfig } from '../../utils/helpers';
import { getCollectionByDocType } from '../../../share/helpers';

export { emailTemplateData } from '../canvas/helpers';

export const getReceivers = (customerElement, user) =>
  customerElement.linkedTo.map(({ documentId, documentType }) => {
    const doc = getCollectionByDocType(documentType).findOne({ _id: documentId });
    const linkedAuditConfig = getLinkedDocAuditConfig(documentType);
    const notify = linkedAuditConfig.docNotifyList(doc);

    return getNotifyReceivers({ notify }, user);
  });
