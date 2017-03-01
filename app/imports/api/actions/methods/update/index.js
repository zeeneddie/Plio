import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Actions } from '/imports/share/collections/actions';
import ActionService from '../../action-service';
import { CheckedMethod } from '../../../method';
import { always, T } from '../../../helpers';
import { IdSchema } from '/imports/share/schemas/schemas';
import UpdateSchema from './schema';

const update = new CheckedMethod({
  name: 'Actions.update',

  check: checker => checker(Actions)(always(T)),

  validate: new SimpleSchema([IdSchema, UpdateSchema]).validator(),

  run({ ...args }) {
    console.log(args);
    return ActionService.update({ ...args });
  },
});

export default update;
