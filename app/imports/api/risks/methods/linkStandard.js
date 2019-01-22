import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { MiddlewareMethod } from '../../method';
import { idSchemaDoc } from '../../../share/schemas/schemas';
import {
  checkDocExistanceById,
  checkOrgMembershipByDocument,
} from '../../middleware';
import { Risks } from '../../../share/collections';
import { RiskService } from '../../../share/services';
import checkLoggedIn from '../../../share/middleware/Auth/checkLoggedIn';

export default new MiddlewareMethod({
  name: 'Risks.linkStandard',
  validate: new SimpleSchema({
    _id: idSchemaDoc,
    standardId: idSchemaDoc,
  }).validator(),
  middleware: [
    checkLoggedIn(),
    checkDocExistanceById(Risks),
    checkOrgMembershipByDocument(),
  ],
  run: RiskService.linkStandard.bind(RiskService),
});
