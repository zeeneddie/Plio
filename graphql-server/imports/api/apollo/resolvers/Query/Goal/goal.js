import { applyMiddleware } from 'plio-util';

import {
  checkLoggedIn,
  checkGoalAccess,
} from '../../../../../share/middleware';

export const resolver = async goal => ({ goal });

export default applyMiddleware(
  checkLoggedIn(),
  checkGoalAccess(),
)(resolver);
