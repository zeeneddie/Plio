import { Benefits } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getBenefitDesc, getBenefitName } from '../../../helpers/description';
import { getCanvasUrl } from '../../../helpers/url';

export default ({ organization: { serialNumber } }) => ({
  collection: Benefits,
  collectionName: CollectionNames.BENEFITS,
  description: getBenefitDesc(),
  getDocConfig: benefit => ({
    title: getBenefitName(benefit),
    url: getCanvasUrl(serialNumber),
  }),
});
