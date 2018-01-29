import { Meteor } from 'meteor/meteor';
import { curry } from 'ramda';
import { check } from 'meteor/check';
import { applyMiddleware, unpromisify } from 'plio-util';

export default curry((handler, { name, middleware = [] }) => {
  check(name, String);

  return Meteor.publish(name, function publicationHandler(...args) {
    const { userId } = this;
    const root = {};
    const context = { userId };

    try {
      return Meteor.wrapAsync(
        unpromisify(
          applyMiddleware(...middleware)(
            (_, ...rest) => handler.call(this, ...rest),
          )(root, ...args, context),
        ),
      )();
    } catch (err) {
      console.error(`Publication error: ${err.message}`);
      return this.ready();
    }
  });
});
