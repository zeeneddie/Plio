import { isCustomerElement, getCustomerElementData, getCustomerElementReceivers } from './helpers';

export default {
  logs: [],
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
