import { isCustomerElement, getCustomerElementData, getCustomerElementReceivers } from './helpers';
import { getCollectionNameByDocType } from '../../../share/helpers';

export default {
  logs: [
    {
      shouldCreateLog: ({ oldDoc }) => isCustomerElement(oldDoc.rel1),
      message:
        '{{{rel1Desc}}} {{{rel1Name}}} was unlinked from ' +
        '{{{rel2Desc}}} {{{rel2Name}}}',
      data: ({ oldDoc }) => getCustomerElementData(oldDoc),
      logData: ({ oldDoc: { rel1: { documentId, documentType } } }) => ({
        documentId,
        collection: getCollectionNameByDocType(documentType),
      }),
    },
  ],
  notifications: [
    {
      shouldSendNotification: ({ oldDoc }) => isCustomerElement(oldDoc.rel1),
      text: '{{{userName}}} unlinked the {{{rel2Desc}}} {{{rel2Name}}} ' +
      'in the "{{{rel2LinkedDocName}}}" {{{rel2LinkedDocDesc}}} ' +
      'from the {{{rel1Desc}}} {{{rel1Name}}} ' +
      'in the "{{{rel1LinkedDocName}}}" {{{rel1LinkedDocDesc}}}',
      data: ({ oldDoc }) => getCustomerElementData(oldDoc),
      receivers: ({ oldDoc, user }) => getCustomerElementReceivers(oldDoc, user),
    },
  ],
};
