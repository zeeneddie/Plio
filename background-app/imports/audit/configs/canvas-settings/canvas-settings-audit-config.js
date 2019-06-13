import { getId, getOrganizationId, noop } from 'plio-util';

import * as UpdateHandlers from './fields';
import { CanvasSettings, Organizations } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import OrgAuditConfig from '../organizations/org-audit-config';

export default {
  updateHandlers: Object.values(UpdateHandlers),
  docId: getId,
  docName: noop,
  docDescription: noop,
  docOrgId: getOrganizationId,
  collection: CanvasSettings,
  collectionName: CollectionNames.CANVAS_SETTINGS,
  docUrl: ({ organizationId }) => {
    const organization = Organizations.findOne({ _id: organizationId });
    return OrgAuditConfig.docUrl(organization);
  },
};
