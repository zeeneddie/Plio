import { Meteor } from 'meteor/meteor';
import { curry } from 'ramda';
import { check } from 'meteor/check';
import { applyMiddleware, unpromisify } from 'plio-util';

import * as collections from '../../../share/collections';
import * as services from '../../../share/services';

const createPublisher = fn => curry((handler, { name, middleware = [] }) => {
  check(name, String);

  return fn(name, function publicationHandler(...args) {
    const { userId } = this;
    const root = {};
    const context = { userId, collections, services };

    try {
      return Meteor.wrapAsync(
        unpromisify(
          applyMiddleware(...middleware)(
            (_, ...rest) => handler.call(this, ...rest),
          )(root, ...args, context),
        ),
      )();
    } catch ({ error = 500, message = 'Internal server error' }) {
      console.error(`Publication error: ${message}`);
      return this.error(new Meteor.Error(error, message));
    }
  });
});


export const publishWithMiddleware = createPublisher(Meteor.publish.bind(Meteor.publish));

export const publishCompositeWithMiddleware = createPublisher(
  Meteor.publishComposite.bind(Meteor.publishComposite),
);
