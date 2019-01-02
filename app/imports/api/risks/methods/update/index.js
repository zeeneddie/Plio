import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import RisksService from '/imports/share/services/risks-service';
import { Risks } from '/imports/share/collections/risks';
import { IdSchema } from '/imports/share/schemas/schemas';
import { CheckedMethod } from '../../../method';
import UpdateSchema from './schema';
import { always, T } from '../../../helpers';

export default new CheckedMethod({
  name: 'Risks.update',

  validate: new SimpleSchema([IdSchema, UpdateSchema]).validator(),

  check: checker => checker(Risks)(always(T)),

  run({ ...args }) {
    return RisksService._update({ ...args });
  },
});
