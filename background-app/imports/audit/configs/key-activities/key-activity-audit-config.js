import { compose } from 'ramda';

import { KeyActivities } from '../../../share/collections';
import { CollectionNames, CanvasTypes } from '../../../share/constants';
import { getKeyActivityDesc } from '../../../helpers/description';
import {
  getDocUrlByOrganizationId,
  getDocUnsubscribePath,
} from '../../../helpers/url';
import CanvasAuditConfig from '../canvas/canvas-audit-config';

export default {
  ...CanvasAuditConfig,
  collection: KeyActivities,
  collectionName: CollectionNames.KEY_ACTIVITIES,
  docDescription: getKeyActivityDesc,
  docUnsubscribeUrl: compose(
    getDocUnsubscribePath,
    getDocUrlByOrganizationId(CanvasTypes.KEY_ACTIVITY),
  ),
};
