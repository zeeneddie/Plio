import { getId, getOrganizationId, getNotify } from 'plio-util';
import { compose } from 'ramda';

import { Goals, Organizations } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
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
import { getDocUrlByOrganizationId, getDocUnsubscribePath } from '../../../helpers/url';

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
  docUrl: ({ organizationId }) => {
    const query = { _id: organizationId };
    const options = { fields: { serialNumber: 1 } };
    const { serialNumber } = Organizations.findOne(query, options);

    return `${serialNumber}`;
  },
  docUnsubscribeUrl: compose(getDocUnsubscribePath, getDocUrlByOrganizationId('goals')),
};
