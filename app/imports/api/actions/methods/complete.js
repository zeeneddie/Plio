import { MiddlewareMethod } from '../../method';
import { CompleteActionSchema } from '../../../share/schemas/schemas';
import {
  checkDocExistanceById,
  checkOrgMembershipByDocument,
} from '../../middleware';
import { Actions } from '../../../share/collections';
import { ActionService } from '../../../share/services';
import { checkLoggedIn, ensureActionCanBeCompleted } from '../../../share/middleware';

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
