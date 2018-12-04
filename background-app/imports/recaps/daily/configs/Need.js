import { Needs } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getNeedDesc, getNeedName } from '../../../helpers/description';
import { getCanvasUrl } from '../../../helpers/url';

export default ({ organization: { serialNumber } }) => ({
  collection: Needs,
  collectionName: CollectionNames.NEEDS,
  description: getNeedDesc(),
  getDocConfig: need => ({
    title: getNeedName(need),
    url: getCanvasUrl(serialNumber),
  }),
});
