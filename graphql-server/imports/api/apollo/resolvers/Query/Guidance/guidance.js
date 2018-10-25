import { applyMiddleware } from 'plio-util';

import { checkLoggedIn } from '../../../../../share/middleware';

export const resolver = async (root, args, context) => {
  const { documentType } = args;
  const { collections: { Guidances } } = context;

  return Guidances.findOne({ documentType });
};

export default applyMiddleware(
  checkLoggedIn(),
)(resolver);
