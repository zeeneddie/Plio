import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { MiddlewareMethod } from '../../method';
import { IdSchema } from '../../../share/schemas/schemas';
import {
  checkDocExistanceById,
  checkOrgMembershipByDocument,
} from '../../middleware';
import { Actions } from '../../../share/collections';
import { ActionService } from '../../../share/services';
import { checkLoggedIn, ensureActionCanBeVerified } from '../../../share/middleware';

export default new MiddlewareMethod({
  name: 'Actions.verify',
  validate: new SimpleSchema([
    IdSchema,
    {
      success: { type: Boolean },
      verificationComments: { type: String },
    },
  ]).validator(),
  middleware: [
    checkLoggedIn(),
    checkDocExistanceById(Actions),
    checkOrgMembershipByDocument(),
    ensureActionCanBeVerified(),
  ],
  run: ActionService.verify.bind(ActionService),
});
