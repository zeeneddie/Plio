import onCreated from '../common/on-created';
import { getReceivers } from './helpers';
import { getLinkedDocName, getLinkedDocDescription } from '../../utils/helpers';

export default {
  logs: [onCreated.logs.default],
  notifications: [
    {
      text: '{{{userName}}} has added the {{{docDesc}}} {{{docName}}} ' +
      'to the "{{{linkedDocName}}}" {{{linkedDocDesc}}} ' +
      'on the {{{orgName}}} canvas',
      data({ newDoc }) {
        return newDoc.linkedTo.map(({ documentId, documentType }) => ({
          linkedDocDesc: getLinkedDocDescription(documentId, documentType),
          linkedDocName: getLinkedDocName(documentId, documentType),
        }));
      },
      receivers({ newDoc, user }) {
        return getReceivers(newDoc, user);
      },
    },
  ],
};
