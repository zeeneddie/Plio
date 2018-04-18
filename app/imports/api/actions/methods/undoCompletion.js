import { MiddlewareMethod } from '../../method';
import { IdSchema } from '../../../share/schemas/schemas';
import {
  checkDocExistanceById,
  checkOrgMembershipByDocument,
} from '../../middleware';
import { Actions } from '../../../share/collections';
import { ActionService } from '../../../share/services';
import { checkLoggedIn, ensureCanUndoActionCompletion } from '../../../share/middleware';

export default new MiddlewareMethod({
  name: 'Actions.undoCompletion',
  validate: IdSchema.validator(),
  middleware: [
    checkLoggedIn(),
    checkDocExistanceById(Actions),
    checkOrgMembershipByDocument(),
    ensureCanUndoActionCompletion(),
  ],
  run: ActionService.undoCompletion.bind(ActionService),
});
