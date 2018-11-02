import { Benefits } from '../../../share/collections';
import { CollectionNames, Abbreviations } from '../../../share/constants';
import { getBenefitDesc, getCustomerElementName } from '../../../helpers/description';
import CustomerElementAuditConfig from '../customer-elements/customer-element-audit-config';

export default {
  ...CustomerElementAuditConfig,
  collection: Benefits,
  collectionName: CollectionNames.BENEFITS,
  docName: getCustomerElementName(Abbreviations.BENEFIT),
  docDescription: getBenefitDesc,
};
