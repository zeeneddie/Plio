import { Needs } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getNeedDesc, getNeedName } from '../../../helpers/description';
import { getCanvasUrl } from '../../../helpers/url';
import { getDailyRecapCanvasTitle } from '../helpers/canvas';

export default ({ organization: { serialNumber } }) => ({
  collection: Needs,
  collectionName: CollectionNames.NEEDS,
  title: getDailyRecapCanvasTitle,
  description: getNeedDesc(),
  getDocConfig: need => ({
    title: getNeedName(need),
    url: getCanvasUrl(serialNumber),
  }),
});
