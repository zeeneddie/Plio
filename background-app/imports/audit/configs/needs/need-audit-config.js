import { Needs } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getNeedDesc, getNeedName } from '../../../helpers/description';
import CustomerElementAuditConfig from '../customer-elements/customer-element-audit-config';

export default {
  ...CustomerElementAuditConfig,
  collection: Needs,
  collectionName: CollectionNames.NEEDS,
  docName: getNeedName,
  docDescription: getNeedDesc,
};
