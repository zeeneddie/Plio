import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidationError } from 'meteor/mdg:validation-error';
import property from 'lodash.property';

import { ReviewSchema } from '/imports/share/schemas/review-schema';
import { Reviews } from '/imports/share/collections/reviews';
import { IdSchema } from '/imports/share/schemas/schemas';
import { exists, checkOrgMembership } from '../checkers';
import Method from '../method';
import ReviewService from './review-service';
import { compose } from '../helpers';

const checkReviewExistance = exists(Reviews);

export const updateViewedBy = new Method({
  name: 'Reviews.updateViewedBy',

  validate: IdSchema.validator(),

  check(checker) {
    return checker(compose(
      ({ organizationId }) => checkOrgMembership(this.userId, organizationId),
      checkReviewExistance(property('_id')),
    ));
  },

  run({ _id }) {
    return ReviewService.updateViewedBy({ _id, viewedBy: this.userId });
  },
});

export const insert = new Method({
  name: 'Reviews.insert',

  validate(doc) {
    ReviewSchema.clean(doc, {
      removeEmptyStrings: true,
    });

    return ReviewSchema.validator()(doc);
  },

  check(checker) {
    return checker(({ organizationId }) => checkOrgMembership(this.userId, organizationId));
  },

  run(args) {
    return ReviewService.insert(args);
  },
});

export const update = new Method({
  name: 'Reviews.update',

  validate(doc) {
    const validationContext = new SimpleSchema([
      IdSchema,
      ReviewSchema,
    ]).newContext();

    Object.keys(doc).forEach((key) => {
      if (!validationContext.validateOne(doc, key)) {
        const errors = validationContext.invalidKeys();
        const message = validationContext.keyErrorMessage(errors[0].name);
        throw new ValidationError(errors, message);
      }
    });
  },

  check(checker) {
    return checker(compose(
      ({ organizationId }) => checkOrgMembership(this.userId, organizationId),
      checkReviewExistance(property('_id')),
    ));
  },

  run(args) {
    return ReviewService.update(args);
  },
});

export const remove = new Method({
  name: 'Reviews.remove',

  validate: IdSchema.validator(),

  check(checker) {
    return checker(compose(
      ({ organizationId }) => checkOrgMembership(this.userId, organizationId),
      checkReviewExistance(property('_id')),
    ));
  },

  run({ _id }) {
    return ReviewService.remove({ _id });
  },
});
