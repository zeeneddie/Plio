import { Risks } from '/imports/share/collections/risks.js';
import RiskService from './risks-service.js';
import { Discussions } from '/imports/share/collections/discussions.js';
import DiscussionsService from '../discussions/discussions-service.js';
import FilesService from '../files/files-service.js';
import { DocumentTypes } from '/imports/share/constants.js';
import WorkItemService from '../work-items/work-item-service.js';

Risks.after.insert((userId, { _id, organizationId }) => {
  DiscussionsService.insert({
    organizationId,
    documentType: DocumentTypes.RISK,
    linkedTo: _id,
    isPrimary: true,
  });
});

Risks.after.remove((userId, doc) => {
  Discussions.remove({ linkedTo: doc._id });

  const fileIds = doc.fileIds;
  if (fileIds) {
    FilesService.bulkRemove({ fileIds });
  }

  RiskService.unlinkActions({ _id: doc._id });

  WorkItemService.removePermanently({ query: { 'linkedDoc._id': doc._id } });
});
