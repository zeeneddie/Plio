import { Meteor } from 'meteor/meteor';

import { CollectionNames } from '/imports/share/constants';
import { Standards } from '/imports/share/collections/standards';
import { Organizations } from '/imports/share/collections/organizations';

import onCreated from './on-created';
import onRemoved from './on-removed';

import departmentsIds from './fields/departmentsIds';
import description from './fields/description';
import improvementPlanDesiredOutcome from './fields/improvementPlan.desiredOutcome';
import improvementPlanFileIds from './fields/improvementPlan.fileIds';
import improvementPlanOwner from './fields/improvementPlan.owner';
import improvementPlanReviewDatesDate from './fields/improvementPlan.reviewDates.date';
import improvementPlanReviewDates from './fields/improvementPlan.reviewDates';
import improvementPlanTargetDate from './fields/improvementPlan.targetDate';
import isDeleted from './fields/isDeleted';
import issueNumber from './fields/issueNumber';
import notify from './fields/notify';
import owner from './fields/owner';
import sectionId from './fields/sectionId';
import status from './fields/status';
import title from './fields/title';
import typeId from './fields/typeId';


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
    typeId,
  ],

  onRemoved,

  docId({ _id }) {
    return _id;
  },

  docDescription() {
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
      rootUrl: Meteor.settings.mainApp.url,
    });
  },

};
