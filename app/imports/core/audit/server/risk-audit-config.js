import { Risks } from '/imports/api/risks/risks.js';
import { CollectionNames } from '/imports/api/constants.js';
import { ChangesKinds } from './audit-utils.js';
import Utils from '../../utils.js';


export default {

  collection: Risks,

  collectionName: CollectionNames.RISKS,

  onCreated: {
    logTemplate: 'Document created',
    notificationTemplate: '',
    logData() { },
    notificationData() { },
    notificationReceivers() { }
  },

  updateHandlers: [

  ],

  onRemoved: {
    logTemplate: 'Document removed',
    notificationTemplate: '',
    logData() { },
    notificationData() { },
    notificationReceivers() { }
  },

  docId({ _id }) {
    return _id;
  },

  docDescription({ sequentialId, title }) {
    return `${sequentialId} "${title}"`;
  },

  actionLinkChanged: {
    logTemplate:
      '{{{actionDesc}}} was {{#if linked}}linked to{{else}}unlinked from{{/if}} this document',
    notificationTemplate:
      '{{userName}} {{#if linked}}linked {{{actionDesc}}} to {{else}} unlinked {{{actionDesc}}} from {{/if}}{{{docDesc}}}',
    logData({ actionDesc, linked, documentId, executor }) {
      return { actionDesc, linked };
    },
    notificationData({ actionDesc, linked, documentId, newDoc }) {
      return {
        docDesc: this.docDescription(documentId),
        userName: Utils.getUserFullNameOrEmail(newDoc.updatedBy),
        actionDesc,
        linked
      };
    },
    notificationReceivers({ documentId }) {

    }
  }

};
