import { lenses, getId, getOrganizationId, getNotify } from 'plio-util';
import { view } from 'ramda';

import { getCanvasUrl } from '../../../helpers/url';
import { getCanvasDocName } from '../../../helpers/description';
import onCreated from './on-created';
import onRemoved from './on-removed';
import * as UpdateHandlers from './fields';

export default {
  onCreated,
  onRemoved,
  updateHandlers: Object.values(UpdateHandlers),
  docId: getId,
  docName: getCanvasDocName,
  docOrgId: getOrganizationId,
  docNotifyList: getNotify,
  docOwner: view(lenses.originatorId),
  docUrl: ({ organizationId }) => getCanvasUrl(organizationId),
};
