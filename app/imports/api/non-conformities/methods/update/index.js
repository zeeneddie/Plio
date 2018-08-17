import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { CheckedMethod } from '../../../method';
import { IdSchema } from '/imports/share/schemas/schemas';
import { NonConformities } from '/imports/share/collections/non-conformities';
import NonConformitiesService from '/imports/share/services/non-conformities-service';
import UpdateSchema from './schema';

export default new CheckedMethod({
  name: 'NonConformities.update',

  validate: new SimpleSchema([IdSchema, UpdateSchema]).validator(),

  check: checker => checker(NonConformities)(() => () => true),

  run({ ...args }) {
    return NonConformitiesService.update({ ...args });
  },
});
