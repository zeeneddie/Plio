import { canChangeHelpDocs, checkAndThrow } from '/imports/api/helpers';
import { CANNOT_CHANGE_HELP_DOCS } from './errors';


export const ensureCanChangeHelpDocs = (userId) => {
  checkAndThrow(!canChangeHelpDocs(userId), CANNOT_CHANGE_HELP_DOCS);
  return true;
};
