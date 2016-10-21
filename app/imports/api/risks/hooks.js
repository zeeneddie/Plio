import { Risks } from '/imports/share/collections/risks.js';
import FilesService from '../files/files-service.js';

Risks.after.remove((userId, doc) => {
  const fileIds = doc.fileIds;
  if (fileIds) {
    FilesService.bulkRemove({ fileIds });
  }
});
