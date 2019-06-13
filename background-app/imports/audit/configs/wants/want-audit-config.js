import { Wants } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getWantDesc, getWantName } from '../../../helpers/description';
import CustomerElementAuditConfig from '../customer-elements/customer-element-audit-config';

export default {
  ...CustomerElementAuditConfig,
  collection: Wants,
  collectionName: CollectionNames.WANTS,
  docName: getWantName,
  docDescription: getWantDesc,
};
