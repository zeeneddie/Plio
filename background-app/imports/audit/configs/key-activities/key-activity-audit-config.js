import { compose } from 'ramda';

import { KeyActivities } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getKeyActivityDesc } from '../../../helpers/description';
import {
  getDocUrlByOrganizationId,
  getDocUnsubscribePath,
  getCanvasUrl,
} from '../../../helpers/url';
import CanvasAuditConfig from '../canvas/canvas-audit-config';

export default {
  ...CanvasAuditConfig,
  collection: KeyActivities,
  collectionName: CollectionNames.KEY_ACTIVITIES,
  docDescription: getKeyActivityDesc,
  docUrl: getCanvasUrl,
  docUnsubscribeUrl: compose(getDocUnsubscribePath, getDocUrlByOrganizationId('keyActivities')),
};
