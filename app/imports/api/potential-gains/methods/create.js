import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Method from '../../method';
import { PotentialGainsSchema } from '../../../share/schemas/potential-gains-schema';

export const insert = new Method({
  name: 'NonConformities.insert',

  validate: new SimpleSchema({}).validator(),

  run({}) {
  },
});
