import { NonConformities } from './non-conformities.js';
import FilesService from '../files/files-service.js';

NonConformities.after.remove((userId, doc) => {
  const fileIds = doc.fileIds;
  if (fileIds) {
    FilesService.bulkRemove({ fileIds });
  }
});
