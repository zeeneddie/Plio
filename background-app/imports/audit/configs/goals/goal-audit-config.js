import { getId, getOrganizationId, getNotify } from 'plio-util';
import { compose } from 'ramda';

import { Goals } from '../../../share/collections';
import { CollectionNames, DocumentTypes } from '../../../share/constants';
import { getGoalName, getGoalDesc } from '../../../helpers/description';
import onCreated from './on-created';
import onRemoved from './on-removed';
import {
  title,
  description,
  ownerId,
  startDate,
  endDate,
  priority,
  color,
  status,
  isCompleted,
  notify,
  fileIds,
} from './fields';
import { getDocUrlByOrganizationId, getDocUnsubscribePath, getGoalUrl } from '../../../helpers/url';

export default {
  onCreated,
  onRemoved,
  collection: Goals,
  collectionName: CollectionNames.GOALS,
  updateHandlers: [
    title,
    description,
    ownerId,
    startDate,
    endDate,
    priority,
    color,
    status,
    isCompleted,
    notify,
    fileIds,
  ],
  docId: getId,
  docDescription: getGoalDesc,
  docName: getGoalName,
  docOrgId: getOrganizationId,
  docNotifyList: getNotify,
  docUrl: getGoalUrl,
  docUnsubscribeUrl: compose(getDocUnsubscribePath, getDocUrlByOrganizationId(DocumentTypes.GOAL)),
};
