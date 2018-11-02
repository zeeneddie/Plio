import { compose } from 'ramda';

import { KeyResources } from '../../../share/collections';
import { CollectionNames, CanvasTypes } from '../../../share/constants';
import { getKeyResourceDesc } from '../../../helpers/description';
import {
  getDocUrlByOrganizationId,
  getDocUnsubscribePath,
} from '../../../helpers/url';
import CanvasAuditConfig from '../canvas/canvas-audit-config';

export default {
  ...CanvasAuditConfig,
  collection: KeyResources,
  collectionName: CollectionNames.KEY_RESOURCES,
  docDescription: getKeyResourceDesc,
  docUnsubscribeUrl: compose(
    getDocUnsubscribePath,
    getDocUrlByOrganizationId(CanvasTypes.KEY_RESOURCE),
  ),
};
