import { applyMiddleware } from 'plio-util';

import {
  checkLoggedIn,
  flattenInput,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.UserService.updatePreferences(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  async (next, root, args, context) => {
    await next(root, args, context);

    const { userId, collections: { Users } } = context;
    return Users.findOne({ _id: userId });
  },
)(resolver);
