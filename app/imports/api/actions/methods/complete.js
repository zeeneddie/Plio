import { MiddlewareMethod } from '../../method';
import { CompleteActionSchema } from '../../../share/schemas/schemas';
import {
  checkDocExistanceById,
  checkOrgMembershipByDocument,
} from '../../middleware';
import { Actions } from '../../../share/collections';
import { ActionService } from '../../../share/services';
import { ensureCanBeCompleted } from '../middleware';
import { checkLoggedIn } from '../../../share/middleware';

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
