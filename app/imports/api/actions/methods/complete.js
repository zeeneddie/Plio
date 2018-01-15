import { MiddlewareMethod } from '../../method';
import { CompleteActionSchema } from '../../../share/schemas/schemas';
import {
  checkLoggedIn,
  checkDocExistanceById,
  checkOrgMembershipByDocument,
} from '../../middleware';
import { Actions } from '../../../share/collections';
import { ActionService } from '../../../share/services';
import { ensureCanBeCompleted } from '../middleware';

export default new MiddlewareMethod({
  name: 'Actions.complete',
  validate: CompleteActionSchema.validator(),
  middleware: [
    checkLoggedIn(),
    checkDocExistanceById(Actions),
    checkOrgMembershipByDocument(),
    ensureCanBeCompleted(),
  ],
  run: ActionService.complete.bind(ActionService),
});
