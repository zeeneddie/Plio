import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { MiddlewareMethod } from '../../method';
import { OrganizationIdSchema } from '../../../share/schemas/schemas';
import { checkOrgMembership } from '../../middleware';
import { RiskService } from '../../../share/services';

export default new MiddlewareMethod({
  name: 'Risks.get.linkable',
  validate: new SimpleSchema([
    OrganizationIdSchema,
    {
      ids: {
        type: [String],
        regEx: SimpleSchema.RegEx.Id,
      },
    },
  ]).validator(),
  middleware: [checkOrgMembership()],
  run: RiskService.getLinkable.bind(RiskService),
});
