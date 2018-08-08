import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkActionAccess,
  actionUpdateAfterware,
  checkOrgMembership,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { ActionService } }) =>
  ActionService.set(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkActionAccess(),
  checkOrgMembership(({ organizationId }, { ownerId }) => ({
    organizationId,
    userId: ownerId,
  })),
  actionUpdateAfterware(),
)(resolver);
