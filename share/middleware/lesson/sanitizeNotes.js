import sanitizeHtml from 'sanitize-html';
import { over } from 'ramda';
import { lenses } from 'plio-util';

export default () => async (next, root, args, context) => next(
  root,
  over(lenses.notes, sanitizeHtml, args),
  context,
);
