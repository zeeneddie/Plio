import { compose } from 'ramda';

import { RevenueStreams } from '../../../share/collections';
import { CollectionNames, CanvasTypes } from '../../../share/constants';
import { getRevenueStreamDesc } from '../../../helpers/description';
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
  collection: RevenueStreams,
  collectionName: CollectionNames.REVENUE_STREAMS,
  docDescription: getRevenueStreamDesc,
  docUnsubscribeUrl: compose(
    getDocUnsubscribePath,
    getDocUrlByOrganizationId(CanvasTypes.REVENUE_STREAM),
  ),
};
