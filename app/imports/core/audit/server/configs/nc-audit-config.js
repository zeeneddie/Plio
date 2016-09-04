import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { CollectionNames } from '/imports/api/constants.js';
import { ChangesKinds } from '../utils/changes-kinds.js';


export default {

  collection: NonConformities,

  collectionName: CollectionNames.NCS,

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
  }
  
};
