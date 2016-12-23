import { Meteor } from 'meteor/meteor';

import { CollectionNames } from '/imports/share/constants.js';
import { Standards } from '/imports/share/collections/standards.js';
import { Organizations } from '/imports/share/collections/organizations.js';

import onCreated from './on-created.js';
import onRemoved from './on-removed.js';

import departmentsIds from './fields/departmentsIds.js';
import description from './fields/description.js';
import improvementPlanDesiredOutcome from './fields/improvementPlan.desiredOutcome.js';
import improvementPlanFileIds from './fields/improvementPlan.fileIds.js';
import improvementPlanOwner from './fields/improvementPlan.owner.js';
import improvementPlanReviewDatesDate from './fields/improvementPlan.reviewDates.date.js';
import improvementPlanReviewDates from './fields/improvementPlan.reviewDates.js';
import improvementPlanTargetDate from './fields/improvementPlan.targetDate.js';
import isDeleted from './fields/isDeleted.js';
import issueNumber from './fields/issueNumber.js';
import notify from './fields/notify.js';
import owner from './fields/owner.js';
import sectionId from './fields/sectionId.js';
import status from './fields/status.js';
import title from './fields/title.js';
import typeId from './fields/typeId.js';


export default StandardAuditConfig = {

  collection: Standards,

  collectionName: CollectionNames.STANDARDS,

  onCreated,

  updateHandlers: [
    departmentsIds,
    description,
    improvementPlanDesiredOutcome,
    improvementPlanFileIds,
    improvementPlanOwner,
    improvementPlanReviewDatesDate,
    improvementPlanReviewDates,
    improvementPlanTargetDate,
    isDeleted,
    issueNumber,
    notify,
    owner,
    sectionId,
    status,
    title,
    typeId
  ],

  onRemoved,

  docId({ _id }) {
    return _id;
  },

  docDescription(doc) {
    return 'standard';
  },

  docName({ title }) {
    return `"${title}"`;
  },

  docOrgId({ organizationId }) {
    return organizationId;
  },

  docUrl({ _id, organizationId }) {
    const { serialNumber } = Organizations.findOne({ _id: organizationId });
    return Meteor.absoluteUrl(`${serialNumber}/standards/${_id}`, {
      rootUrl: Meteor.settings.mainApp.url
    });
  }

};
