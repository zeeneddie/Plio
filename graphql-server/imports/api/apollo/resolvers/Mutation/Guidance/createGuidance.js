import sanitizeHtml from 'sanitize-html';
import { over } from 'ramda';
import { applyMiddleware, lenses } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  ensureUserIsPlioAdmin,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.GuidanceService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  ensureUserIsPlioAdmin(),
  flattenInput(),
  async (next, root, args, context) => next(
    root,
    over(lenses.html, sanitizeHtml, args),
    context,
  ),
  async (next, root, args, context) => {
    const _id = await next(root, args, context);
    const { collections: { Guidances } } = context;
    return Guidances.findOne({ _id });
  },
)(resolver);
