import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { MiddlewareMethod } from '../../method';
import { checkOrgMembership } from '../../middleware/auth';
import { PotentialGainsSchema } from '../../../share/schemas/potential-gains-schema';
import PotentialGainsService from '../../../share/services/potential-gains-service';

const NAME = 'PG.insert';
const validate = new SimpleSchema([
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
const middleware = [checkOrgMembership()];
// const run = PotentialGainsService.insert;
const run = () => true;

export default new MiddlewareMethod({
  name: NAME,
  validate,
  middleware,
  run,
});
