import { applyMiddleware } from 'plio-util';

import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
} from '../../../../../share/middleware';
import Errors from '../../../../../share/errors';
import { getOwnerId } from '../../../../../share/helpers/Organization';

export const resolver = async (root, args, context) =>
  context.services.UserService.reassignOwnership(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership((root, { userId }) => ({ userId })),
  async (next, root, args, context) => {
    const { ownerId } = args;
    const { organization } = context;

    if (!ownerId) {
      const orgOwnerId = getOwnerId(organization);

      return next(root, { ...args, ownerId: orgOwnerId }, context);
    }

    return next(root, args, context);
  },
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
