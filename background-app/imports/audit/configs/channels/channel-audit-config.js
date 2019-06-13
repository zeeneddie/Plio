import { compose } from 'ramda';

import { Channels } from '../../../share/collections';
import { CollectionNames, CanvasTypes } from '../../../share/constants';
import { getChannelDesc } from '../../../helpers/description';
import {
  getDocUrlByOrganizationId,
  getDocUnsubscribePath,
} from '../../../helpers/url';
import CanvasAuditConfig from '../canvas/canvas-audit-config';

export default {
  ...CanvasAuditConfig,
  collection: Channels,
  collectionName: CollectionNames.CHANNELS,
  docDescription: getChannelDesc,
  docUnsubscribeUrl: compose(getDocUnsubscribePath, getDocUrlByOrganizationId(CanvasTypes.CHANNEL)),
};
