import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import curry from 'lodash.curry';

import { UNAUTHORIZED } from './errors';
import { checkDocAndMembershipAndMore } from './checkers';

export default class Method extends ValidatedMethod {
  constructor(props) {
    const { run } = props;

    props.mixins = Object.assign([], props.mixins).concat(LoggedInMixin);
    props.checkLoggedInError = {
      error: '403',
      reason: UNAUTHORIZED.reason,
    };

    props.run = function ({ ...args }) {
      const res = props.check && props.check.call(this, checker => checker.call(this, { ...args }));

      return run.call(this, { ...args }, res);
    };

    super(props);
  }
}

export class CheckedMethod extends ValidatedMethod {
  constructor(props) {
    if (!props.check) throw new Error('"check" method is required');

    const { run } = props;

    props.mixins = Object.assign([], props.mixins).concat(LoggedInMixin);
    props.checkLoggedInError = {
      error: '403',
      reason: UNAUTHORIZED.reason,
    };

    props.run = function ({ ...args }) {
      const userId = this.userId;

      const res = props.check(collection => (checker, err) => checkDocAndMembershipAndMore(collection, args._id, userId)(curry(checker)({ ...args, userId }), err));

      return run.call(this, { ...args }, res);
    };

    super(props);
  }
}

const composeMiddleware = (...functions) => {
  if (functions.length === 1) {
    return functions[0];
  }

  return functions.reduceRight((f, next) => (...args) => next(f, ...args));
};

function applyMiddleware(...middleware) {
  middleware.forEach((layer) => {
    if (typeof layer !== 'function') {
      throw new TypeError('Expected all provided middleware to be functions.');
    }
  });

  return (handler) => {
    if (typeof handler !== 'function') {
      // eslint-disable-next-line max-len
      throw new TypeError('Expected handler to be a function. Middleware can only be applied to functions.');
    }

    return composeMiddleware(...middleware, handler);
  };
}

export class MiddlewareMethod extends ValidatedMethod {
  constructor({ middleware, ...props }) {
    const mixins = [function (options) {
      Object.assign(options, {
        callP: function callP(args) {
          return new Promise((resolve, reject) => {
            this.call(args, (err, res) => {
              if (err) reject(err);
              else resolve(res);
            });
          });
        },
      });
      return options;
    }];

    const run = async function (args) {
      const { userId } = this;
      const context = { userId };
      return applyMiddleware(...middleware)(props.run.bind(this))(args, context);
    };

    super({ ...props, run, mixins });
  }
}
