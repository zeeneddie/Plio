import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
} from '../../../../../share/middleware';
import Errors from '../../../../../share/errors';

export const resolver = async (root, args, context) =>
  context.services.UserService.reassignOwnership(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership((root, { userId }) => ({ userId })),
  checkOrgMembership((root, { ownerId }) => ({ userId: ownerId })),
  async (next, root, args, context) => {
    const { userId, ownerId } = args;

    if (userId === ownerId) {
      throw new Error(Errors.CANNOT_REASSIGN_OWNERSHIP_TO_YOURSELF);
    }

    return next(root, args, context);
  },
  async (next, root, args, context) => {
    await next(root, args, context);
    return null;
  },
)(resolver);
