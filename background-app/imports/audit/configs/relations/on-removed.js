import { isCustomerElement, getCustomerElementData, getCustomerElementReceivers } from './helpers';

export default {
  logs: [],
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
