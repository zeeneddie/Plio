import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { UNAUTHORIZED } from './errors.js';

export default class Method extends ValidatedMethod {
  constructor(props) {
    props.mixins = Object.assign([], props.mixins).concat(LoggedInMixin);
    props.checkLoggedInError = {
      error: 'notLogged',
      reason: UNAUTHORIZED.reason
    };

    super(props);
  }
}
