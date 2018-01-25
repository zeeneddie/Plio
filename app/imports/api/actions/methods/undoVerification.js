import { MiddlewareMethod } from '../../method';
import { IdSchema } from '../../../share/schemas/schemas';
import {
  checkLoggedIn,
  checkDocExistanceById,
  checkOrgMembershipByDocument,
} from '../../middleware';
import { Actions } from '../../../share/collections';
import { ActionService } from '../../../share/services';
import { ensureCanUndoVerification } from '../middleware';

export default new MiddlewareMethod({
  name: 'Actions.undoVerification',
  validate: IdSchema.validator(),
  middleware: [
    checkLoggedIn(),
    checkDocExistanceById(Actions),
    checkOrgMembershipByDocument(),
    ensureCanUndoVerification(),
  ],
  run: ActionService.undoVerification.bind(ActionService),
});
