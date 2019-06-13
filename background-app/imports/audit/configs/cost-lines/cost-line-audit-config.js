import { compose } from 'ramda';

import { CostLines } from '../../../share/collections';
import { CollectionNames, CanvasTypes } from '../../../share/constants';
import { getCostLineDesc } from '../../../helpers/description';
import * as UpdateHandlers from './fields';
import {
  getDocUrlByOrganizationId,
  getDocUnsubscribePath,
} from '../../../helpers/url';
import CanvasAuditConfig from '../canvas/canvas-audit-config';

export default {
  ...CanvasAuditConfig,
  updateHandlers: [
    ...CanvasAuditConfig.updateHandlers,
    ...Object.values(UpdateHandlers),
  ],
  collection: CostLines,
  collectionName: CollectionNames.COST_LINES,
  docDescription: getCostLineDesc,
  docUnsubscribeUrl: compose(
    getDocUnsubscribePath,
    getDocUrlByOrganizationId(CanvasTypes.COST_LINE),
  ),
};
