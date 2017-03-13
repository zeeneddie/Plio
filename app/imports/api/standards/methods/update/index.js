import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { CheckedMethod } from '../../../method';
import { IdSchema } from '/imports/share/schemas/schemas';
import { Standards } from '/imports/share/collections/standards';
import { S_EnsureCanChangeChecker as ensureCanChange } from '../../checkers';
import StandardsService from '../../standards-service';

import UpdateSchema from './schema';

export default new CheckedMethod({
  name: 'Standards.update',

  validate: new SimpleSchema([IdSchema, UpdateSchema]).validator(),

  check: checker => checker(Standards)(ensureCanChange),

  run({ ...args }) {
    return StandardsService.update({ ...args });
  },
});
