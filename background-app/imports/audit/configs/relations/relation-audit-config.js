import { getId } from 'plio-util';

import onCreated from './on-created';
import onRemoved from './on-removed';
import { Relations } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';

export default {
  onCreated,
  onRemoved,
  updateHandlers: [],
  docId: getId,
  collection: Relations,
  collectionName: CollectionNames.RELATIONS,
  docName: () => '',
  docDescription: () => 'Relation',
  docUrl: () => null,
  docOrgId: ({ rel1, rel2 }) => rel1.organizationId || rel2.organizationId,
};
