import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { MiddlewareMethod } from '../../method';
import { standardsIdsSchema, IdSchema } from '../../../share/schemas/schemas';
import { checkOrgMembership, checkDocExistanceById } from '../../middleware';
import { Risks } from '../../../share/collections';
import { RiskService } from '../../../share/services';

export default new MiddlewareMethod({
  name: 'Risks.linkToStandards',
  validate: new SimpleSchema([
    IdSchema,
    standardsIdsSchema,
  ]).validator(),
  middleware: [
    checkDocExistanceById(Risks),
    checkOrgMembership(),
  ],
  run: RiskService.linkToStandards.bind(RiskService),
});
