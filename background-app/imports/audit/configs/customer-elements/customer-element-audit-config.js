import { getId, getOrganizationId } from 'plio-util';

import { getCanvasUrl } from '../../../helpers/url';
import onCreated from './on-created';
import onRemoved from './on-removed';
import * as UpdateHandlers from './fields';

export default {
  onCreated,
  onRemoved,
  updateHandlers: Object.values(UpdateHandlers),
  docId: getId,
  docOrgId: getOrganizationId,
  docUrl: getCanvasUrl,
};
