import { ValuePropositions } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getValuePropositionDesc, getCanvasDocName } from '../../../helpers/description';
import { getCanvasUrl } from '../../../helpers/url';

export default ({ organization: { serialNumber } }) => ({
  collection: ValuePropositions,
  collectionName: CollectionNames.VALUE_PROPOSITIONS,
  description: getValuePropositionDesc(),
  getDocConfig: valueProposition => ({
    title: getCanvasDocName(valueProposition),
    url: getCanvasUrl(serialNumber),
  }),
});
