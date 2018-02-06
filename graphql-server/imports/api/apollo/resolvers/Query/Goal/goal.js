import { applyMiddleware } from 'plio-util';

import {
  checkLoggedIn,
  checkGoalAccess,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { operation }) => ({
  goal: operation.doc,
});

export default applyMiddleware(
  checkLoggedIn(),
  checkGoalAccess(),
)(resolver);
