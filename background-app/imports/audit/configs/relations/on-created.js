import { isCustomerElement, getCustomerElementData, getCustomerElementReceivers } from './helpers';
import { getCollectionNameByDocType } from '../../../share/helpers';

export default {
  logs: [
    {
      shouldCreateLog: ({ newDoc }) => isCustomerElement(newDoc.rel1),
      message:
        '{{{rel1Desc}}} {{{rel1Name}}} was linked to ' +
        '{{{rel2Desc}}} {{{rel2Name}}}',
      data: ({ newDoc }) => getCustomerElementData(newDoc),
      logData: ({ newDoc: { rel1: { documentId, documentType } } }) => ({
        documentId,
        collection: getCollectionNameByDocType(documentType),
      }),
    },
  ],
  notifications: [
    {
      shouldSendNotification: ({ newDoc }) => isCustomerElement(newDoc.rel1),
      text: '{{{userName}}} linked the {{{rel1Desc}}} {{{rel1Name}}} ' +
      'in the "{{{rel1LinkedDocName}}}" {{{rel1LinkedDocDesc}}} ' +
      'to the {{{rel2Desc}}} {{{rel2Name}}} ' +
      'in the "{{{rel2LinkedDocName}}}" {{{rel2LinkedDocDesc}}}',
      data: ({ newDoc }) => getCustomerElementData(newDoc),
      receivers: ({ newDoc, user }) => getCustomerElementReceivers(newDoc, user),
    },
  ],
};
