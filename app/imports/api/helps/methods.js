import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidationError } from 'meteor/mdg:validation-error';

import { IdSchema } from '/imports/share/schemas/schemas';
import { HelpSchema } from '/imports/share/schemas/help-schema';
import { S_EnsureCanChange } from '../standards/checkers';
import { CheckedMethod } from '../method';
import HelpService from './help-service';


const check = function check(checker) {
  return checker(
    ({ organizationId }) => S_EnsureCanChange(this.userId, organizationId)
  );
};

export const insert = new CheckedMethod({
  name: 'Helps.insert',

  validate: HelpSchema.validator(),

  check,

  run({ ...args }) {
    return HelpService.insert(args);
  },
});

export const update = new CheckedMethod({
  name: 'Helps.update',

  validate(args) {
    const validationContext = new SimpleSchema([
      IdSchema,
      HelpSchema,
    ]).newContext();

    for (let key in args) {
      if (!validationContext.validateOne(args, key)) {
        const errors = validationContext.invalidKeys();
        const message = validationContext.keyErrorMessage(errors[0].name);
        throw new ValidationError(errors, message);
      }
    }
  },

  check,

  run({ ...args }) {
    return HelpService.update(args);
  },
});

export const remove = new CheckedMethod({
  name: 'Helps.remove',

  validate: IdSchema.validator(),

  check,

  run({ _id }) {
    return HelpService.remove({ _id, deletedBy: this.userId });
  },
});

export const restore = new CheckedMethod({
  name: 'Helps.restore',

  validate: IdSchema.validator(),

  check,

  run({ _id }) {
    return HelpService.restore({ _id });
  },
});
