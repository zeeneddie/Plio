import { _ } from 'meteor/underscore';

import { Actions } from '/imports/share/collections/actions';
import { ActionTypes, CollectionNames } from '/imports/share/constants';

import onCreated from './on-created';
import onRemoved from './on-removed';

import completedAt from './fields/completedAt';
import completedBy from './fields/completedBy';
import completionComments from './fields/completionComments';
import completionTargetDate from './fields/completionTargetDate';
import fileIds from './fields/fileIds';
import isCompleted from './fields/isCompleted';
import isDeleted from './fields/isDeleted';
import isVerified from './fields/isVerified';
import linkedTo from './fields/linkedTo';
import notes from './fields/notes';
import notify from './fields/notify';
import ownerId from './fields/ownerId';
import planInPlace from './fields/planInPlace';
import status from './fields/status';
import title from './fields/title';
import toBeCompletedBy from './fields/toBeCompletedBy';
import toBeVerifiedBy from './fields/toBeVerifiedBy';
import verificationComments from './fields/verificationComments';
import verificationTargetDate from './fields/verificationTargetDate';
import verifiedAt from './fields/verifiedAt';
import verifiedBy from './fields/verifiedBy';
import { getDocUrlByOrganizationId, getDocUnsubscribePath } from '/imports/helpers/url';

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

  docUrl() { },

  docNotifyList({ notify: notifyList = [] }) {
    return notifyList;
  },

  docUnsubscribeUrl: _.compose(
    getDocUnsubscribePath,
    getDocUrlByOrganizationId('actions')
  ),

};
