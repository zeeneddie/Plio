import { KeyActivities } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getKeyActivityDesc, getCanvasDocName } from '../../../helpers/description';
import { getCanvasUrl } from '../../../helpers/url';

export default ({ organization: { serialNumber } }) => ({
  collection: KeyActivities,
  collectionName: CollectionNames.KEY_ACTIVITIES,
  description: getKeyActivityDesc(),
  getDocConfig: keyActivity => ({
    title: getCanvasDocName(keyActivity),
    url: getCanvasUrl(serialNumber),
  }),
});
