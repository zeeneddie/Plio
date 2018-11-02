import { Features } from '../../../share/collections';
import { CollectionNames, Abbreviations } from '../../../share/constants';
import { getFeatureDesc, getCustomerElementName } from '../../../helpers/description';
import CustomerElementAuditConfig from '../customer-elements/customer-element-audit-config';

export default {
  ...CustomerElementAuditConfig,
  collection: Features,
  collectionName: CollectionNames.FEATURES,
  docName: getCustomerElementName(Abbreviations.FEATURE),
  docDescription: getFeatureDesc,
};
