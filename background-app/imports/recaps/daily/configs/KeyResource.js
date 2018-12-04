import { KeyResources } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getKeyResourceDesc, getCanvasDocName } from '../../../helpers/description';
import { getCanvasUrl } from '../../../helpers/url';

export default ({ organization: { serialNumber } }) => ({
  collection: KeyResources,
  collectionName: CollectionNames.KEY_RESOURCES,
  description: getKeyResourceDesc(),
  getDocConfig: keyActivity => ({
    title: getCanvasDocName(keyActivity),
    url: getCanvasUrl(serialNumber),
  }),
});
