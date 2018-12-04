import { Wants } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getWantDesc, getWantName } from '../../../helpers/description';
import { getCanvasUrl } from '../../../helpers/url';

export default ({ organization: { serialNumber } }) => ({
  collection: Wants,
  collectionName: CollectionNames.WANTS,
  description: getWantDesc(),
  getDocConfig: want => ({
    title: getWantName(want),
    url: getCanvasUrl(serialNumber),
  }),
});
