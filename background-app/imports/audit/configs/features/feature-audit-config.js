import { Features } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getFeatureDesc, getFeatureName } from '../../../helpers/description';
import CustomerElementAuditConfig from '../customer-elements/customer-element-audit-config';

export default {
  ...CustomerElementAuditConfig,
  collection: Features,
  collectionName: CollectionNames.FEATURES,
  docName: getFeatureName,
  docDescription: getFeatureDesc,
};
