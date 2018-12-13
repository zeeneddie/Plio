import { KeyPartners } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getKeyPartnerDesc, getCanvasDocName } from '../../../helpers/description';
import { getCanvasUrl } from '../../../helpers/url';

export default ({ organization: { serialNumber } }) => ({
  collection: KeyPartners,
  collectionName: CollectionNames.KEY_PARTNERS,
  description: getKeyPartnerDesc(),
  getDocConfig: keyPartner => ({
    title: getCanvasDocName(keyPartner),
    url: getCanvasUrl(serialNumber),
  }),
});
