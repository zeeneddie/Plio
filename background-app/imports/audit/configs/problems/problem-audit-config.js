import { ProblemMagnitudes, ProblemsStatuses } from '/imports/share/constants.js';
import { Standards } from '/imports/share/collections/standards.js';
import { getUserFullNameOrEmail, getPrettyOrgDate, getUserId } from '../../utils/helpers.js';
import StandardAuditConfig from '../standards/standard-audit-config.js';

import onCreated from './on-created.js';
import onRemoved from './on-removed.js';

import analysisCompletedAt from './fields/analysis.completedAt.js';
import analysisCompletedBy from './fields/analysis.completedBy.js';
import analysisCompletionComments from './fields/analysis.completionComments.js';
import analysisExecutor from './fields/analysis.executor.js';
import analysisStatus from './fields/analysis.status.js';
import analysisTargetDate from './fields/analysis.targetDate.js';
import departmentsIds from './fields/departmentsIds.js';
import description from './fields/description.js';
import fileIds from './fields/fileIds.js';
import identifiedAt from './fields/identifiedAt.js';
import identifiedBy from './fields/identifiedBy.js';
import isDeleted from './fields/isDeleted.js';
import magnitude from './fields/magnitude.js';
import notify from './fields/notify.js';
import standardsIds from './fields/standardsIds.js';
import status from './fields/status.js';
import title from './fields/title.js';
import updateOfStandardsCompletedAt from './fields/updateOfStandards.completedAt.js';
import updateOfStandardsCompletedBy from './fields/updateOfStandards.completedBy.js';
import updateOfStandardsCompletionComments from './fields/updateOfStandards.completionComments.js';
import updateOfStandardsExecutor from './fields/updateOfStandards.executor.js';
import updateOfStandardsStatus from './fields/updateOfStandards.status.js';
import updateOfStandardsTargetDate from './fields/updateOfStandards.targetDate.js';


export default ProblemAuditConfig = {

  onCreated,

  updateHandlers: [
    analysisCompletedAt,
    analysisCompletedBy,
    analysisCompletionComments,
    analysisExecutor,
    analysisStatus,
    analysisTargetDate,
    departmentsIds,
    description,
    fileIds,
    identifiedAt,
    identifiedBy,
    isDeleted,
    magnitude,
    notify,
    standardsIds,
    status,
    title,
    updateOfStandardsCompletedAt,
    updateOfStandardsCompletedBy,
    updateOfStandardsCompletionComments,
    updateOfStandardsExecutor,
    updateOfStandardsStatus,
    updateOfStandardsTargetDate
  ],

  onRemoved,

  docId({ _id }) {
    return _id;
  },

  docName({ sequentialId, title }) {
    return `${sequentialId} "${title}"`;
  },

  docOrgId({ organizationId }) {
    return organizationId;
  }

};
