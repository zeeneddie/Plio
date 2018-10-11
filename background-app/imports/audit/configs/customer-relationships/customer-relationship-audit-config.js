import { compose } from 'ramda';

import { CustomerRelationships } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getCustomerRelationshipDesc } from '../../../helpers/description';
import {
  getDocUrlByOrganizationId,
  getDocUnsubscribePath,
  getCanvasUrl,
} from '../../../helpers/url';
import CanvasAuditConfig from '../canvas/canvas-audit-config';

export default {
  ...CanvasAuditConfig,
  collection: CustomerRelationships,
  collectionName: CollectionNames.CUSTOMER_RELATIONSHIPS,
  docDescription: getCustomerRelationshipDesc,
  docUrl: getCanvasUrl,
  docUnsubscribeUrl: compose(
    getDocUnsubscribePath,
    getDocUrlByOrganizationId('customerRelationships'),
  ),
};
