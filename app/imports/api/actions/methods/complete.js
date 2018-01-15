import { ifElse, compose, tap } from 'ramda';

import { MiddlewareMethod } from '../../method';
import { CompleteActionSchema } from '../../../share/schemas/schemas';
import {
  checkLoggedIn,
  checkDocExistanceById,
  checkOrgMembershipByDocument,
} from '../../middleware';
import { Actions } from '../../../share/collections';
import { ActionService } from '../../../share/services';
import { canBeCompleted } from '../checkers';
import { ACT_CANNOT_COMPLETE } from '../errors';

export default new MiddlewareMethod({
  name: 'Actions.complete',
  validate: CompleteActionSchema.validator(),
  middleware: [
    checkLoggedIn(),
    checkDocExistanceById(Actions),
    checkOrgMembershipByDocument(),
    (next, args, context) => ifElse(
      (_, { userId, doc }) => canBeCompleted(doc, userId),
      next,
      () => {
        throw ACT_CANNOT_COMPLETE;
      },
    )(args, context),
  ],
  run: ActionService.complete.bind(ActionService),
});
