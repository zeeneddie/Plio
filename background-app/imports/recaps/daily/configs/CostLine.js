import { CostLines } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getCostLineDesc, getCanvasDocName } from '../../../helpers/description';
import { getCanvasUrl } from '../../../helpers/url';

export default ({ organization: { serialNumber } }) => ({
  collection: CostLines,
  collectionName: CollectionNames.COST_LINES,
  description: getCostLineDesc(),
  getDocConfig: costLine => ({
    title: getCanvasDocName(costLine),
    url: getCanvasUrl(serialNumber),
  }),
});
