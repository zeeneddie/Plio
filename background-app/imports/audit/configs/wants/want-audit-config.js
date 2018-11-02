import { Wants } from '../../../share/collections';
import { CollectionNames, Abbreviations } from '../../../share/constants';
import { getWantDesc, getCustomerElementName } from '../../../helpers/description';
import CustomerElementAuditConfig from '../customer-elements/customer-element-audit-config';

export default {
  ...CustomerElementAuditConfig,
  collection: Wants,
  collectionName: CollectionNames.WANTS,
  docName: getCustomerElementName(Abbreviations.WANT),
  docDescription: getWantDesc,
};
