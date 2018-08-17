import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidationError } from 'meteor/mdg:validation-error';

import { IdSchema, optionsSchema } from '/imports/share/schemas/schemas';
import { HelpDocSchema } from '/imports/share/schemas/help-doc-schema';
import { ensureCanChangeHelpDocs } from './checkers';
import { CheckedMethod } from '../method';
import HelpDocService from './help-doc-service';


export const insert = new CheckedMethod({
  name: 'HelpDocs.insert',

  validate: HelpDocSchema.validator(),

  check(checker) {
    return checker(() => ensureCanChangeHelpDocs(this.userId));
  },

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
      optionsSchema,
    ]).newContext();

    for (const key in args) {
      if (!validationContext.validateOne(args, key)) {
        const errors = validationContext.invalidKeys();
        const message = validationContext.keyErrorMessage(errors[0].name);
        throw new ValidationError(errors, message);
      }
    }
  },

  check(checker) {
    return checker(() => ensureCanChangeHelpDocs(this.userId));
  },

  run({ ...args }) {
    return HelpDocService.update(args);
  },
});

export const remove = new CheckedMethod({
  name: 'HelpDocs.remove',

  validate: IdSchema.validator(),

  check(checker) {
    return checker(() => ensureCanChangeHelpDocs(this.userId));
  },

  run({ ...args }) {
    return HelpDocService.remove(args);
  },
});
