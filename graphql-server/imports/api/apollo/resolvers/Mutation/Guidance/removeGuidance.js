import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  ensureUserIsPlioAdmin,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.GuidanceService.remove(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  ensureUserIsPlioAdmin(),
  flattenInput(),
  async (next, root, args, context) => {
    const { _id } = args;
    const { collections: { Guidances } } = context;
    const guidance = Guidances.findOne({ _id });

    await next(root, args, context);

    return guidance;
  },
)(resolver);
