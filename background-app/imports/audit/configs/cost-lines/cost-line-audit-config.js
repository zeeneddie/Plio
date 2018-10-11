import { compose } from 'ramda';

import { CostLines } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getCostLineDesc } from '../../../helpers/description';
import * as UpdateHandlers from './fields';
import {
  getDocUrlByOrganizationId,
  getDocUnsubscribePath,
  getCanvasUrl,
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
  docUrl: getCanvasUrl,
  docUnsubscribeUrl: compose(getDocUnsubscribePath, getDocUrlByOrganizationId('costLines')),
};
