import { compose } from 'ramda';

import { KeyPartners } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getKeyPartnerDesc } from '../../../helpers/description';
import * as UpdateHandlers from './fields';
import {
  getDocUrlByOrganizationId,
  getDocUnsubscribePath,
  getCanvasUrl,
} from '../../../helpers/url';
import CanvasAuditConfig from '../canvas/canvas-audit-config';

export default {
  ...CanvasAuditConfig,
  updateHandlers: [
    ...CanvasAuditConfig.updateHandlers,
    ...Object.values(UpdateHandlers),
  ],
  collection: KeyPartners,
  collectionName: CollectionNames.KEY_PARTNERS,
  docDescription: getKeyPartnerDesc,
  docUrl: getCanvasUrl,
  docUnsubscribeUrl: compose(getDocUnsubscribePath, getDocUrlByOrganizationId('keyPartners')),
};
