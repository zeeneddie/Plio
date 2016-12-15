import get from 'lodash.get';

import { HelpDocs } from '/imports/share/collections/help-docs.js';
import FilesService from '../files/files-service.js';


HelpDocs.after.remove((userId, doc) => {
  const fileId = get(doc, 'source.fileId');
  if (fileId) {
    FilesService.remove({ _id: fileId });
  }
});
