import { NonConformities } from './non-conformities.js';
import FilesService from '../files/files-service.js';

import get from 'lodash.get';

NonConformities.after.remove((userId, doc) => {
  let fileIds = doc.fileIds || [];

  const improvementPlanFileIds = get(doc, 'improvementPlan.fileIds');
  if (!!improvementPlanFileIds) {
    fileIds = fileIds.concat(improvementPlanFileIds);
  }

  FilesService.bulkRemove({ fileIds });
});