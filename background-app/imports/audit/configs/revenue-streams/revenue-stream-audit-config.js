import { compose } from 'ramda';

import { RevenueStreams } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getRevenueStreamDesc } from '../../../helpers/description';
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
  collection: RevenueStreams,
  collectionName: CollectionNames.REVENUE_STREAMS,
  docDescription: getRevenueStreamDesc,
  docUrl: getCanvasUrl,
  docUnsubscribeUrl: compose(getDocUnsubscribePath, getDocUrlByOrganizationId('revenueStreams')),
};
