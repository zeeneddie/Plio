import { Standards } from '/imports/share/collections/standards.js';
import { LessonsLearned } from '/imports/share/collections/lessons.js';
import { Discussions } from '/imports/share/collections/discussions.js';
import DiscussionsService from '../discussions/discussions-service.js';
import { DocumentTypes } from '/imports/share/constants.js';
import FilesService from '../files/files-service.js';
import StandardService from './standards-service.js';

import get from 'lodash.get';

Standards.after.insert((userId, { _id, organizationId }) => {
  DiscussionsService.insert({
    organizationId,
    linkedTo: _id,
    documentType: DocumentTypes.STANDARD,
    isPrimary: true,
  });
});

Standards.after.remove((userId, doc) => {
  LessonsLearned.remove({ documentId: doc._id });
  Discussions.remove({ linkedTo: doc._id });

  // Remove standard files
  (() => {
    let fileIds = [];
    const source1FileId = get(doc, 'source1.fileId');
    source1FileId && fileIds.push(source1FileId);
    const source2FileId = get(doc, 'source2.fileId');
    source2FileId && fileIds.push(source2FileId);

    const improvementPlanFileIds = get(doc, 'improvementPlan.fileIds');
    if (!!improvementPlanFileIds) {
      fileIds = fileIds.concat(improvementPlanFileIds);
    }

    FilesService.bulkRemove({ fileIds });
  })();

  StandardService.unlinkProblemDocs({ _id: doc._id });
});
