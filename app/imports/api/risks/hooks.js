import { Risks } from '/imports/share/collections/risks.js';
import RiskService from './risks-service.js';
import FilesService from '../files/files-service.js';
import WorkItemService from '../work-items/work-item-service.js';

Risks.after.remove((userId, doc) => {
  const fileIds = doc.fileIds;
  if (fileIds) {
    FilesService.bulkRemove({ fileIds });
  }

  RiskService.unlinkActions({ _id: doc._id });

  WorkItemService.removePermanently({ query: { 'linkedDoc._id': doc._id } });
});
