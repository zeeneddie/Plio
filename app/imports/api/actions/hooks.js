import { Actions } from '/imports/share/collections/actions.js';
import FilesService from '../files/files-service.js';

Actions.after.remove((userId, doc) => {
  const fileIds = doc.fileIds;
  if (fileIds) {
    FilesService.bulkRemove({ fileIds });
  }
});
