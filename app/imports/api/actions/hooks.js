import { Actions } from '/imports/share/collections/actions.js';
import FilesService from '../files/files-service.js';
import WorkItemService from '/imports/share/services/work-item-service';

Actions.after.remove((userId, doc) => {
  const fileIds = doc.fileIds;
  if (fileIds) {
    FilesService.bulkRemove({ fileIds });
  }

  WorkItemService.removePermanently({ query: { 'linkedDoc._id': doc._id } });
});
