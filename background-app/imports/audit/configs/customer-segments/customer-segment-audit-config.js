import { compose } from 'ramda';

import { CustomerSegments } from '../../../share/collections';
import { CollectionNames, CanvasTypes } from '../../../share/constants';
import { getCustomerSegmentDesc } from '../../../helpers/description';
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
  collection: CustomerSegments,
  collectionName: CollectionNames.CUSTOMER_SEGMENTS,
  docDescription: getCustomerSegmentDesc,
  docUnsubscribeUrl: compose(
    getDocUnsubscribePath,
    getDocUrlByOrganizationId(CanvasTypes.CUSTOMER_SEGMENT),
  ),
};
