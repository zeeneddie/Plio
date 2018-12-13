import { Features } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getFeatureDesc, getFeatureName } from '../../../helpers/description';
import { getCanvasUrl } from '../../../helpers/url';

export default ({ organization: { serialNumber } }) => ({
  collection: Features,
  collectionName: CollectionNames.FEATURES,
  description: getFeatureDesc(),
  getDocConfig: feature => ({
    title: getFeatureName(feature),
    url: getCanvasUrl(serialNumber),
  }),
});
