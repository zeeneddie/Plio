import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import RisksService from '../../risks-service';
import { Risks } from '/imports/share/collections/risks';
import { IdSchema, optionsSchema } from '/imports/share/schemas/schemas';
import {
  RisksUpdateSchema,
} from '/imports/share/schemas/risks-schema';
import { CheckedMethod } from '../../../method';

export default new CheckedMethod({
  name: 'Risks.update',

  validate: new SimpleSchema([
    IdSchema,
    RisksUpdateSchema,
    optionsSchema,
  ]).validator(),

  check(checker) {
    return true;
    // const _checker = (...args) =>
    //   (doc) => {
    //     if (_.has(args, ['scoredBy', 'scoredAt']) && !doc.score) {
    //       throw ACCESS_DENIED;
    //     }
    //     return checkAnalysis(doc, args);
    //   };
    //
    // return checker(Risks)(_checker);
  },

  run({ ...args }) {
    console.log(args);
    return RisksService.update({ ...args });
  },
});
