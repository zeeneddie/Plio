import { getId, getOrganizationId } from 'plio-util';

import onCreated from './on-created';
import onRemoved from './on-removed';
import * as UpdateHandlers from './fields';
import CanvasAuditConfig from '../canvas/canvas-audit-config';

export default {
  onCreated,
  onRemoved,
  updateHandlers: Object.values(UpdateHandlers),
  docId: getId,
  docOrgId: getOrganizationId,
  docUrl: CanvasAuditConfig.docUrl.bind(CanvasAuditConfig),
};
