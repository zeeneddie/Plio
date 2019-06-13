import { applyMiddleware } from 'plio-util';

import {
  checkLoggedIn,
  checkRiskAccess,
} from '../../../../../share/middleware';

export const resolver = async risk => ({ risk });

export default applyMiddleware(
  checkLoggedIn(),
  checkRiskAccess(),
)(resolver);
