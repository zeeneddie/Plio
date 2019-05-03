import { KeyResources } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getKeyResourceDesc, getCanvasDocName } from '../../../helpers/description';
import { getCanvasUrl } from '../../../helpers/url';
import { getDailyRecapCanvasTitle } from '../helpers/canvas';

export default ({ organization: { serialNumber } }) => ({
  collection: KeyResources,
  collectionName: CollectionNames.KEY_RESOURCES,
  title: getDailyRecapCanvasTitle,
  description: getKeyResourceDesc(),
  getDocConfig: keyActivity => ({
    title: getCanvasDocName(keyActivity),
    url: getCanvasUrl(serialNumber),
  }),
});
