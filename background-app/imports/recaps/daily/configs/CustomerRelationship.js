import { CustomerRelationships } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getCustomerRelationshipDesc, getCanvasDocName } from '../../../helpers/description';
import { getCanvasUrl } from '../../../helpers/url';

export default ({ organization: { serialNumber } }) => ({
  collection: CustomerRelationships,
  collectionName: CollectionNames.CUSTOMER_RELATIONSHIPS,
  description: getCustomerRelationshipDesc(),
  getDocConfig: customerRelationship => ({
    title: getCanvasDocName(customerRelationship),
    url: getCanvasUrl(serialNumber),
  }),
});
