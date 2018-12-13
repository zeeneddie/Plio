import { Standards } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getStandardDesc, getStandardName } from '../../../helpers/description';
import { getStandardUrl } from '../../../helpers/url';

export default ({ organization: { serialNumber } }) => ({
  collection: Standards,
  collectionName: CollectionNames.STANDARDS,
  description: getStandardDesc(),
  getDocConfig: standard => ({
    title: getStandardName(standard),
    url: getStandardUrl(serialNumber, standard._id),
  }),
});
