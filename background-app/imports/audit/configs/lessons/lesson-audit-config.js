import { LessonsLearned } from '/imports/share/collections/lessons.js';
import { CollectionNames } from '/imports/share/constants.js';
import { getLinkedDoc } from '/imports/share/helpers.js';
import { getLinkedDocAuditConfig } from '../../utils/helpers.js';

import onCreated from './on-created.js';
import onRemoved from './on-removed.js';

import date from './fields/date.js';
import notes from './fields/notes.js';
import owner from './fields/owner.js';
import title from './fields/title.js';


export default LessonAuditConfig = {

  collection: LessonsLearned,

  collectionName: CollectionNames.LESSONS,

  onCreated,

  updateHandlers: [
    date,
    notes,
    owner,
    title
  ],

  onRemoved,

  docId({ _id }) {
    return _id;
  },

  docDescription({ serialNumber }) {
    return `LL${serialNumber}`;
  },

  docOrgId({ organizationId }) {
    return organizationId;
  },

  docUrl({ documentId, documentType }) {
    const linkedDocAuditConfig = getLinkedDocAuditConfig(documentType);
    const linkedDoc = getLinkedDoc(documentId, documentType);

    return linkedDocAuditConfig.docUrl(linkedDoc);
  }

};
