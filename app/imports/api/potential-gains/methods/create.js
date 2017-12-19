import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { MiddlewareMethod } from '../../method';
import { checkOrgMembership } from '../../middleware/auth';
import { PotentialGainsSchema } from '../../../share/schemas/potential-gains-schema';
import { PotentialGainService } from '../../../share/services';

export const NAME = 'PG.insert';
export const validate = new SimpleSchema([
  PotentialGainsSchema.pick([
    'organizationId',
    'title',
    'magnitude',
    'standardsIds',
    'standardsIds.$',
    'description',
    'originatorId',
    'ownerId',
  ]),
  {
    standardId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
  },
]).validator();
export const middleware = [checkOrgMembership()];
export const run = PotentialGainService.insert.bind(PotentialGainService);

export default new MiddlewareMethod({
  name: NAME,
  validate,
  middleware,
  run,
});
