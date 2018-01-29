import { applyMiddleware, lenses } from 'plio-util';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = async (root, { _id }, { collections: { Organizations } }) =>
  Organizations.findOne({ _id });

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(lenses._id),
)(resolver);
