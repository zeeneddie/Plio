import { compose } from 'ramda';

import { KeyResources } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getKeyResourceDesc } from '../../../helpers/description';
import {
  getDocUrlByOrganizationId,
  getDocUnsubscribePath,
  getCanvasUrl,
} from '../../../helpers/url';
import CanvasAuditConfig from '../canvas/canvas-audit-config';

export default {
  ...CanvasAuditConfig,
  collection: KeyResources,
  collectionName: CollectionNames.KEY_RESOURCES,
  docDescription: getKeyResourceDesc,
  docUrl: getCanvasUrl,
  docUnsubscribeUrl: compose(getDocUnsubscribePath, getDocUrlByOrganizationId('keyResources')),
};
