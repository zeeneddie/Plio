import { applyMiddleware } from 'plio-util';

import {
  checkLoggedIn,
  checkActionAccess,
} from '../../../../../share/middleware';

export const resolver = async action => ({ action });

export default applyMiddleware(
  checkLoggedIn(),
  checkActionAccess(),
)(resolver);
