import { CustomerSegments } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getCustomerSegmentDesc, getCanvasDocName } from '../../../helpers/description';
import { getCanvasUrl } from '../../../helpers/url';

export default ({ organization: { serialNumber } }) => ({
  collection: CustomerSegments,
  collectionName: CollectionNames.CUSTOMER_SEGMENTS,
  description: getCustomerSegmentDesc(),
  getDocConfig: customerSegment => ({
    title: getCanvasDocName(customerSegment),
    url: getCanvasUrl(serialNumber),
  }),
});
