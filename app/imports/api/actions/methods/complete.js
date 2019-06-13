import { MiddlewareMethod } from '../../method';
import { CompleteActionSchema } from '../../../share/schemas/schemas';
import {
  checkDocExistanceById,
  checkOrgMembershipByDocument,
} from '../../middleware';
import { Actions } from '../../../share/collections';
import { ActionService } from '../../../share/services';
import checkLoggedIn from '../../../share/middleware/Auth/checkLoggedIn';
import ensureActionCanBeCompleted
  from '../../../share/middleware/Action/ensureActionCanBeCompleted';

export default new MiddlewareMethod({
  name: 'Actions.complete',
  validate: CompleteActionSchema.validator(),
  middleware: [
    checkLoggedIn(),
    checkDocExistanceById(Actions),
    checkOrgMembershipByDocument(),
    ensureActionCanBeCompleted(),
  ],
  run: ActionService.complete.bind(ActionService),
});
