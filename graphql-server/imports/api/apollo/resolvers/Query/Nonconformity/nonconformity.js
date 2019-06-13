import { applyMiddleware } from 'plio-util';

import {
  checkLoggedIn,
  checkNonconformityAccess,
} from '../../../../../share/middleware';

export const resolver = async nonconformity => ({ nonconformity });

export default applyMiddleware(
  checkLoggedIn(),
  checkNonconformityAccess(),
)(resolver);
