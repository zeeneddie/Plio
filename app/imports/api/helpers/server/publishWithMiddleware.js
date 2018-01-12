import { Meteor } from 'meteor/meteor';
import { curry } from 'ramda';
import { check } from 'meteor/check';

import applyMiddleware from '../applyMiddleware';

export default curry((handler, { name, middleware = [] }) => {
  check(name, String);

  return Meteor.publish(name, function publicationHandler(...args) {
    const { userId } = this;
    const context = { userId };

    try {
      return applyMiddleware(...middleware)(handler.bind(this))(...args, context);
    } catch (err) {
      console.error(`Publication error: ${err.message}`);
      return this.ready();
    }
  });
});
