import { LessonsLearned } from '/imports/share/collections/lessons';
import { CollectionNames } from '/imports/share/constants';
import { getLinkedDoc } from '/imports/share/helpers';
import { getLinkedDocAuditConfig } from '../../utils/helpers';

import onCreated from './on-created';
import onRemoved from './on-removed';

import date from './fields/date';
import notes from './fields/notes';
import owner from './fields/owner';
import title from './fields/title';


export default LessonAuditConfig = {

  collection: LessonsLearned,

  collectionName: CollectionNames.LESSONS,

  onCreated,

  updateHandlers: [
    date,
    notes,
    owner,
    title,
  ],

  onRemoved,

  docId({ _id }) {
    return _id;
  },

  docDescription() {
    return 'lesson learned';
  },

  docName({ serialNumber }) {
    return `LL${serialNumber}`;
  },

  docOrgId({ organizationId }) {
    return organizationId;
  },

  docUrl({ documentId, documentType }) {
    const linkedDocAuditConfig = getLinkedDocAuditConfig(documentType);
    const linkedDoc = getLinkedDoc(documentId, documentType);

    return linkedDocAuditConfig.docUrl(linkedDoc);
  },

};
