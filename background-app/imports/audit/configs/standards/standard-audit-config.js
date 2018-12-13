import { _ } from 'meteor/underscore';

import { Standards } from '/imports/share/collections/standards';
import { getStandardDesc, getStandardName } from '/imports/helpers/description';
import { getDocUrlByOrganizationId, getDocUnsubscribePath } from '/imports/helpers/url';
import { propId, propOrganizationId, propNotify, propOwner } from '/imports/helpers/props';

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
import { DocumentTypes, CollectionNames, DocumentTypesPlural } from '../../../share/constants';

const StandardAuditConfig = {

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

  docId: propId,

  docOrgId: propOrganizationId,

  docOwner: propOwner,

  docNotifyList: propNotify,

  docDescription: getStandardDesc,

  docName: getStandardName,

  docUrl: getDocUrlByOrganizationId(DocumentTypesPlural.STANDARDS),

  docUnsubscribeUrl: _.compose(
    getDocUnsubscribePath,
    getDocUrlByOrganizationId(DocumentTypes.STANDARD),
  ),

};

export default StandardAuditConfig;
