import { Needs } from '../../../share/collections';
import { CollectionNames, Abbreviations } from '../../../share/constants';
import { getNeedDesc, getCustomerElementName } from '../../../helpers/description';
import CustomerElementAuditConfig from '../customer-elements/customer-element-audit-config';

export default {
  ...CustomerElementAuditConfig,
  collection: Needs,
  collectionName: CollectionNames.NEEDS,
  docName: getCustomerElementName(Abbreviations.NEED),
  docDescription: getNeedDesc,
};
