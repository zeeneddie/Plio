import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { MiddlewareMethod } from '../../method';
import { standardsIdsSchema } from '../../../share/schemas/schemas';
import { checkOrgMembership } from '../../middleware';

export default new MiddlewareMethod({
  name: 'Risks.linkToStandards',
  validate: standardsIdsSchema.validator(),
  middleware: [],
  run(args, context) {
    
  },
});
