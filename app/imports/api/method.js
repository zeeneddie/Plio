import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import curry from 'lodash.curry';

import { UNAUTHORIZED } from './errors.js';
import { checkDocAndMembershipAndMore } from './checkers.js';

export default class Method extends ValidatedMethod {
  constructor(props) {
    props.mixins = Object.assign([], props.mixins).concat(LoggedInMixin);
    props.checkLoggedInError = {
      error: '403',
      reason: UNAUTHORIZED.reason
    };

    super(props);
  }
}

export class CheckedMethod extends Method {
  constructor(props) {
    const { run } = props;

    props.run = function({ ...args }) {
      const res = props.checker((collection) => {
        return (checker, err) => {
          return checkDocAndMembershipAndMore(collection, args._id, this.userId)(curry(checker)({ ...args }), err);
        };
      });

      return run({ ...args }, res);
    }

    super(props);
  }
}
