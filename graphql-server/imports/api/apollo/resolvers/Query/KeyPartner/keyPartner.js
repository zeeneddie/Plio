import { applyMiddleware } from 'plio-util';

import { checkLoggedIn, checkKeyPartnerAccess } from '../../../../../share/middleware';

export const resolver = keyPartner => ({ keyPartner });

export default applyMiddleware(
  checkLoggedIn(),
  checkKeyPartnerAccess(),
)(resolver);
