import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Discussions } from '/imports/share/collections/discussions.js';
import DiscussionsService from '../discussions/discussions-service.js';
import NonConformityService from '/imports/share/services/non-conformities-service';
import FilesService from '../files/files-service.js';
import { DocumentTypes } from '/imports/share/constants.js';
import WorkItemService from '/imports/share/services/work-item-service';

import get from 'lodash.get';

NonConformities.after.insert((userId, { _id, organizationId }) => {
  DiscussionsService.insert({
    organizationId,
    documentType: DocumentTypes.NON_CONFORMITY,
    linkedTo: _id,
    isPrimary: true,
  });
});

NonConformities.after.remove((userId, doc) => {
  Discussions.remove({ linkedTo: doc._id });

  let fileIds = doc.fileIds || [];
  const improvementPlanFileIds = get(doc, 'improvementPlan.fileIds');
  if (improvementPlanFileIds) {
    fileIds = fileIds.concat(improvementPlanFileIds);
  }

  const rcaFileIds = get(doc, 'rootCauseAnalysis.fileIds');
  if (rcaFileIds) {
    fileIds = fileIds.concat(rcaFileIds);
  }

  FilesService.bulkRemove({ fileIds });

  NonConformityService.unlinkActions({ _id: doc._id });

  WorkItemService.removePermanently({ query: { 'linkedDoc._id': doc._id } });
});
