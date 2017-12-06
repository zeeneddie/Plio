import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import property from 'lodash.property';
import curry from 'lodash.curry';

import OccurrencesService from './occurrences-service';
import { RequiredSchema } from '/imports/share/schemas/occurrences-schema';
import { Occurrences } from '/imports/share/collections/occurrences';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { IdSchema } from '/imports/share/schemas/schemas';
import Method from '../method';
import { exists, OCC_MembershipChecker } from '../checkers';
import { compose, chain, withUserId } from '../helpers';

const checkOccurrenceExistance = exists(Occurrences);

const checkNCExistance = exists(NonConformities);

const checkMembership = withUserId(curry(OCC_MembershipChecker));

export const updateViewedBy = new Method({
  name: 'Occurrences.updateViewedBy',

  validate: IdSchema.validator(),

  check(checker) {
    // check membership and occurrence existance
    // as we need the document itself in checkMembership function we just compose it with checkOccurrenceExistance
    return checker(compose(
      checkMembership(this.userId),
      checkOccurrenceExistance(property('_id')),
    ));
  },

  run({ _id }) {
    return OccurrencesService.updateViewedBy({ _id, userId: this.userId });
  },
});

export const insert = new Method({
  name: 'Occurrences.insert',

  validate: RequiredSchema.validator(),

  check(checker) {
    // we don't need compose there cause nonConformityId is passed through arguments
    return checker(chain(
      checkMembership(this.userId),
      checkNCExistance(property('nonConformityId')),
    ));
  },

  run({ ...args }) {
    return OccurrencesService.insert({ ...args });
  },
});

export const update = new Method({
  name: 'Occurrences.update',

  validate(doc) {
    const validationContext = new SimpleSchema([IdSchema, {
      description: {
        type: String,
      },
      date: {
        type: Date,
      },
    }]).newContext();

    for (const key in doc) {
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
    return checker(compose(
      checkMembership(this.userId),
      checkOccurrenceExistance(property('_id')),
    ));
  },

  run({ ...args }) {
    return OccurrencesService.update({ ...args });
  },
});

export const remove = new Method({
  name: 'Occurrences.remove',

  validate: IdSchema.validator(),

  check(checker) {
    return checker(compose(
      checkMembership(this.userId),
      checkOccurrenceExistance(property('_id')),
    ));
  },

  run({ _id }) {
    return OccurrencesService.remove({ _id });
  },
});
