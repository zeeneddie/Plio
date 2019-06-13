import { compose } from 'ramda';

import { CustomerRelationships } from '../../../share/collections';
import { CollectionNames, CanvasTypes } from '../../../share/constants';
import { getCustomerRelationshipDesc } from '../../../helpers/description';
import {
  getDocUrlByOrganizationId,
  getDocUnsubscribePath,
} from '../../../helpers/url';
import CanvasAuditConfig from '../canvas/canvas-audit-config';

export default {
  ...CanvasAuditConfig,
  collection: CustomerRelationships,
  collectionName: CollectionNames.CUSTOMER_RELATIONSHIPS,
  docDescription: getCustomerRelationshipDesc,
  docUnsubscribeUrl: compose(
    getDocUnsubscribePath,
    getDocUrlByOrganizationId(CanvasTypes.CUSTOMER_RELATIONSHIP),
  ),
};
