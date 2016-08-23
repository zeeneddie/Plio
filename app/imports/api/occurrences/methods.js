import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import property from 'lodash.property';
import curry from 'lodash.curry';

import OccurrencesService from './occurrences-service.js';
import { RequiredSchema } from './occurrences-schema.js';
import { Occurrences } from './occurrences.js';
import { NonConformities } from '../non-conformities/non-conformities.js';
import { IdSchema } from '../schemas.js';
import Method, { CheckedMethod } from '../method.js';
import { chain } from '../helpers.js';
import { exists, OCC_MembershipChecker } from '../checkers.js';

const { compose } = _;

const checkOccurrenceExistance = exists(Occurrences);

const checkNCExistance = exists(NonConformities);

const checkMembership = userId => curry(OCC_MembershipChecker)({ userId });

export const updateViewedBy = new Method({
  name: 'Occurrences.updateViewedBy',

  validate: IdSchema.validator(),

  check(checker) {
    // check membership and occurrence existance
    // as we need the document itself in checkMembership function we just compose it with checkOccurrenceExistance
    return checker(
      compose(
        checkMembership(this.userId),
        checkOccurrenceExistance(property('_id'))
      )
    );
  },

  run({ _id }) {
    return OccurrencesService.updateViewedBy({ _id, userId: this.userId });
  }
});

export const insert = new Method({
  name: 'Occurrences.insert',

  validate: RequiredSchema.validator(),

  check(checker) {
    // we don't need compose there cause nonConformityId is passed through arguments
    return checker(
      chain(
        checkMembership(this.userId),
        checkNCExistance(property('nonConformityId'))
      )
    );
  },

  run({ ...args }) {
    return OccurrencesService.insert({ ...args });
  }
});

export const update = new Method({
  name: 'Occurrences.update',

  validate(doc) {
    const validationContext = new SimpleSchema([IdSchema, {
      description: {
        type: String
      },
      date: {
        type: Date
      }
    }]).newContext();

    for (let key in doc) {
      if (_.isEqual(key, 'description') && _.isEmpty(doc[key])) {
        doc[key] = undefined;
      }

      if (!validationContext.validateOne(doc, key)) {
        const errors = validationContext.invalidKeys();
        const message = validationContext.keyErrorMessage(errors[0].name);
        throw new ValidationError(errors, message);
      }
    }
  },

  check(checker) {
    return checker(
      compose(
        checkMembership(this.userId),
        checkOccurrenceExistance(property('_id'))
      )
    );
  },

  run({ ...args }) {
    return OccurrencesService.update({ ...args });
  }
});

export const remove = new Method({
  name: 'Occurrences.remove',

  validate: IdSchema.validator(),

  check(checker) {
    return checker(
      compose(
        checkMembership(this.userId),
        checkOccurrenceExistance(property('_id'))
      )
    );
  },

  run({ _id }) {
    return OccurrencesService.remove({ _id });
  }
});
