import {
  applyMiddleware,
  lenses,
  loadOrganizationById,
} from 'plio-util';
import { compose, view, nthArg } from 'ramda';
import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const resolver = loadOrganizationById(compose(view(lenses._id), nthArg(1)));

export default applyMiddleware(
  checkLoggedIn(),
  checkOrgMembership(view(lenses._id)),
)(resolver);
