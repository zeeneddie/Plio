import { _ } from 'meteor/underscore';

import { Actions } from '/imports/share/collections/actions.js';
import { ActionTypes, CollectionNames } from '/imports/share/constants.js';

import onCreated from './on-created.js';
import onRemoved from './on-removed.js';

import completedAt from './fields/completedAt.js';
import completedBy from './fields/completedBy.js';
import completionComments from './fields/completionComments.js';
import completionTargetDate from './fields/completionTargetDate.js';
import fileIds from './fields/fileIds.js';
import isCompleted from './fields/isCompleted.js';
import isDeleted from './fields/isDeleted.js';
import isVerified from './fields/isVerified.js';
import linkedTo from './fields/linkedTo.js';
import notes from './fields/notes.js';
import notify from './fields/notify.js';
import ownerId from './fields/ownerId.js';
import planInPlace from './fields/planInPlace.js';
import status from './fields/status.js';
import title from './fields/title.js';
import toBeCompletedBy from './fields/toBeCompletedBy.js';
import toBeVerifiedBy from './fields/toBeVerifiedBy.js';
import verificationComments from './fields/verificationComments.js';
import verificationTargetDate from './fields/verificationTargetDate.js';
import verifiedAt from './fields/verifiedAt.js';
import verifiedBy from './fields/verifiedBy.js';
import { generateDocUrlByPrefix, generateDocUnsubscribeUrl } from '/imports/helpers';

export default ActionAuditConfig = {

  collection: Actions,

  collectionName: CollectionNames.ACTIONS,

  onCreated,

  updateHandlers: [
    completedAt,
    completedBy,
    completionComments,
    completionTargetDate,
    fileIds,
    isCompleted,
    isDeleted,
    isVerified,
    linkedTo,
    notes,
    notify,
    ownerId,
    planInPlace,
    status,
    title,
    toBeCompletedBy,
    toBeVerifiedBy,
    verificationComments,
    verificationTargetDate,
    verifiedAt,
    verifiedBy,
  ],

  onRemoved,

  docId({ _id }) {
    return _id;
  },

  docDescription({ type }) {
    return {
      [ActionTypes.CORRECTIVE_ACTION]: 'corrective action',
      [ActionTypes.PREVENTATIVE_ACTION]: 'preventative action',
      [ActionTypes.RISK_CONTROL]: 'risk control',
    }[type];
  },

  docName({ sequentialId, title }) {
    return `${sequentialId} "${title}"`;
  },

  docOrgId({ organizationId }) {
    return organizationId;
  },

  docUrl(doc) { },

  docUnsubscribeFromNotificationsUrl: _.compose(
    generateDocUnsubscribeUrl,
    generateDocUrlByPrefix('actions')
  ),

  docNotifyList({ notify: notifyList = [] }) {
    return notifyList;
  },
};
