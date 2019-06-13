import { applyMiddleware } from 'plio-util';

import {
  checkLoggedIn,
  checkStandardAccess,
} from '../../../../../share/middleware';

export const resolver = async standard => ({ standard });

export default applyMiddleware(
  checkLoggedIn(),
  checkStandardAccess(),
)(resolver);
