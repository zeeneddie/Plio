import { CostLines } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getCostLineDesc, getCanvasDocName } from '../../../helpers/description';
import { getCanvasUrl } from '../../../helpers/url';
import { getDailyRecapCanvasTitle } from '../helpers/canvas';

export default ({ organization: { serialNumber } }) => ({
  collection: CostLines,
  collectionName: CollectionNames.COST_LINES,
  title: getDailyRecapCanvasTitle,
  description: getCostLineDesc(),
  getDocConfig: costLine => ({
    title: getCanvasDocName(costLine),
    url: getCanvasUrl(serialNumber),
  }),
});
