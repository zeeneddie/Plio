import { compose } from 'ramda';

import { KeyPartners } from '../../../share/collections';
import { CollectionNames, CanvasTypes } from '../../../share/constants';
import { getKeyPartnerDesc } from '../../../helpers/description';
import * as UpdateHandlers from './fields';
import {
  getDocUrlByOrganizationId,
  getDocUnsubscribePath,
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
  docUnsubscribeUrl: compose(
    getDocUnsubscribePath,
    getDocUrlByOrganizationId(CanvasTypes.KEY_PARTNER),
  ),
};
