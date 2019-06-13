import onRemoved from '../common/on-removed';
import { getReceivers } from './helpers';
import { getLinkedDocDescription, getLinkedDocName } from '../../utils/helpers';

export default {
  logs: [
    onRemoved.logs.default,
  ],
  notifications: [
    {
      text: '{{{userName}}} has removed the {{{docDesc}}} {{{docName}}} ' +
      'from the "{{{linkedDocName}}}" {{{linkedDocDesc}}} ' +
      'on the {{{orgName}}} canvas',
      data({ oldDoc }) {
        return oldDoc.linkedTo.map(({ documentId, documentType }) => ({
          linkedDocDesc: getLinkedDocDescription(documentId, documentType),
          linkedDocName: getLinkedDocName(documentId, documentType),
        }));
      },
      receivers({ oldDoc, user }) {
        return getReceivers(oldDoc, user);
      },
    },
  ],
};
