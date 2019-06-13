import { Benefits } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getBenefitDesc, getBenefitName } from '../../../helpers/description';
import CustomerElementAuditConfig from '../customer-elements/customer-element-audit-config';

export default {
  ...CustomerElementAuditConfig,
  collection: Benefits,
  collectionName: CollectionNames.BENEFITS,
  docName: getBenefitName,
  docDescription: getBenefitDesc,
};
