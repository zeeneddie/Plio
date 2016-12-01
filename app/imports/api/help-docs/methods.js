import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidationError } from 'meteor/mdg:validation-error';

import { IdSchema } from '/imports/share/schemas/schemas';
import { HelpDocSchema } from '/imports/share/schemas/help-doc-schema';
import { S_EnsureCanChange } from '../standards/checkers';
import { CheckedMethod } from '../method';
import HelpDocService from './help-doc-service';


const check = function check(checker) {
  return checker(
    ({ organizationId }) => S_EnsureCanChange(this.userId, organizationId)
  );
};

export const insert = new CheckedMethod({
  name: 'HelpDocs.insert',

  validate: HelpDocSchema.validator(),

  check,

  run({ ...args }) {
    return HelpDocService.insert(args);
  },
});

export const update = new CheckedMethod({
  name: 'HelpDocs.update',

  validate(args) {
    const validationContext = new SimpleSchema([
      IdSchema,
      HelpDocSchema,
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
    return HelpDocService.update(args);
  },
});

export const remove = new CheckedMethod({
  name: 'HelpDocs.remove',

  validate: IdSchema.validator(),

  check,

  run({ _id }) {
    return HelpDocService.remove({ _id, deletedBy: this.userId });
  },
});

export const restore = new CheckedMethod({
  name: 'HelpDocs.restore',

  validate: IdSchema.validator(),

  check,

  run({ _id }) {
    return HelpDocService.restore({ _id });
  },
});
