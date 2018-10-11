import { compose } from 'ramda';

import { Channels } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getChannelDesc } from '../../../helpers/description';
import {
  getDocUrlByOrganizationId,
  getDocUnsubscribePath,
  getCanvasUrl,
} from '../../../helpers/url';
import CanvasAuditConfig from '../canvas/canvas-audit-config';

export default {
  ...CanvasAuditConfig,
  collection: Channels,
  collectionName: CollectionNames.CHANNELS,
  docDescription: getChannelDesc,
  docUrl: getCanvasUrl,
  docUnsubscribeUrl: compose(getDocUnsubscribePath, getDocUrlByOrganizationId('channels')),
};
