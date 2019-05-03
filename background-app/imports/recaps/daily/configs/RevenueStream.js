import { RevenueStreams } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getRevenueStreamDesc, getCanvasDocName } from '../../../helpers/description';
import { getCanvasUrl } from '../../../helpers/url';
import { getDailyRecapCanvasTitle } from '../helpers/canvas';

export default ({ organization: { serialNumber } }) => ({
  collection: RevenueStreams,
  collectionName: CollectionNames.REVENUE_STREAMS,
  title: getDailyRecapCanvasTitle,
  description: getRevenueStreamDesc(),
  getDocConfig: revenueStream => ({
    title: getCanvasDocName(revenueStream),
    url: getCanvasUrl(serialNumber),
  }),
});
