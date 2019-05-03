import { CustomerRelationships } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getCustomerRelationshipDesc, getCanvasDocName } from '../../../helpers/description';
import { getCanvasUrl } from '../../../helpers/url';
import { getDailyRecapCanvasTitle } from '../helpers/canvas';

export default ({ organization: { serialNumber } }) => ({
  collection: CustomerRelationships,
  collectionName: CollectionNames.CUSTOMER_RELATIONSHIPS,
  title: getDailyRecapCanvasTitle,
  description: getCustomerRelationshipDesc(),
  getDocConfig: customerRelationship => ({
    title: getCanvasDocName(customerRelationship),
    url: getCanvasUrl(serialNumber),
  }),
});
