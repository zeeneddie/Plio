import { Risks } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getRiskDesc, getProblemName } from '../../../helpers/description';
import { getRiskUrl } from '../../../helpers/url';

export default ({ organization: { serialNumber } }) => ({
  collection: Risks,
  collectionName: CollectionNames.RISKS,
  description: getRiskDesc(),
  getDocConfig: risk => ({
    title: getProblemName(risk),
    url: getRiskUrl(serialNumber, risk._id),
  }),
});
