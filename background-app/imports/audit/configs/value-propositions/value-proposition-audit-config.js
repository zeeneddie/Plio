import { compose } from 'ramda';

import { ValuePropositions } from '../../../share/collections';
import { CollectionNames, CanvasTypes } from '../../../share/constants';
import { getValuePropositionDesc } from '../../../helpers/description';
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
  collection: ValuePropositions,
  collectionName: CollectionNames.VALUE_PROPOSITIONS,
  docDescription: getValuePropositionDesc,
  docUnsubscribeUrl: compose(
    getDocUnsubscribePath,
    getDocUrlByOrganizationId(CanvasTypes.VALUE_PROPOSITION),
  ),
};
