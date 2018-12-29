import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { IdSchema } from '../../../../share/schemas/schemas';
import { NonConformities } from '../../../../share/collections';
import { NonConformityService } from '../../../../share/services';
import { CheckedMethod } from '../../../method';
import UpdateSchema from './schema';

export default new CheckedMethod({
  name: 'NonConformities.update',

  validate: new SimpleSchema([IdSchema, UpdateSchema]).validator(),

  check: checker => checker(NonConformities)(() => () => true),

  run({ ...args }) {
    return NonConformityService._update({ ...args });
  },
});
