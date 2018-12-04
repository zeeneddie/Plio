import { getId } from 'plio-util';
import { prop } from 'ramda';

import onCreated from './on-created';
import onRemoved from './on-removed';
import { Relations } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getCollectionByDocType } from '../../../share/helpers';

const getOrganizationId = ({ documentId, documentType }) => prop(
  'organizationId',
  getCollectionByDocType(documentType).findOne({ _id: documentId }),
);

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
  docOrgId: ({ rel1, rel2 }) => getOrganizationId(rel1) || getOrganizationId(rel2),
};
