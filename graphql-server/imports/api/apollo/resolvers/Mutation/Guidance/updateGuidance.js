import sanitizeHtml from 'sanitize-html';
import { over } from 'ramda';
import { applyMiddleware, lenses } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  ensureUserIsPlioAdmin,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.GuidanceService.update(args, context);

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
    const { documentType } = args;
    const { collections: { Guidances } } = context;
    await next(root, args, context);

    return Guidances.findOne({ documentType });
  },
)(resolver);
