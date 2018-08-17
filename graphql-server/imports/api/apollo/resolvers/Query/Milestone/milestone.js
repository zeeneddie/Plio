import { applyMiddleware } from 'plio-util';

import {
  checkLoggedIn,
  checkMilestoneAccess,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { doc }) => ({ milestone: doc });

export default applyMiddleware(
  checkLoggedIn(),
  checkMilestoneAccess(),
)(resolver);
