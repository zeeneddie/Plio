import { applyMiddleware } from 'plio-util';

import {
  checkLoggedIn,
  checkMilestoneAccess,
} from '../../../../../share/middleware';

export const resolver = async milestone => ({ milestone });

export default applyMiddleware(
  checkLoggedIn(),
  checkMilestoneAccess(),
)(resolver);
