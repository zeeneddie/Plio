import { applyMiddleware } from 'plio-util';

import {
  checkLoggedIn,
  checkActionAccess,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { doc }) => ({ action: doc });

export default applyMiddleware(
  checkLoggedIn(),
  checkActionAccess(),
)(resolver);
