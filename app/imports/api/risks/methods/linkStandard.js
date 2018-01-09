import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { MiddlewareMethod } from '../../method';
import { idSchemaDoc } from '../../../share/schemas/schemas';
import { checkOrgMembershipByDocument, checkDocExistanceById } from '../../middleware';
import { Risks } from '../../../share/collections';
import { RiskService } from '../../../share/services';

export default new MiddlewareMethod({
  name: 'Risks.linkStandard',
  validate: new SimpleSchema({
    _id: idSchemaDoc,
    standardId: idSchemaDoc,
  }).validator(),
  middleware: [
    checkDocExistanceById(Risks),
    checkOrgMembershipByDocument(),
  ],
  run: RiskService.linkStandard.bind(RiskService),
});
