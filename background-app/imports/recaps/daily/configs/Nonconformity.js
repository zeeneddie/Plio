import { NonConformities } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getNCDesc, getProblemName } from '../../../helpers/description';
import { getNCUrl } from '../../../helpers/url';

export default ({ organization: { serialNumber } }) => ({
  collection: NonConformities,
  collectionName: CollectionNames.NCS,
  description: getNCDesc(),
  getDocConfig: nonconformity => ({
    title: getProblemName(nonconformity),
    url: getNCUrl(serialNumber, nonconformity._id),
  }),
});
