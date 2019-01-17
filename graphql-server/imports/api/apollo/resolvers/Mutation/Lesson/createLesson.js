import { applyMiddleware, lenses } from 'plio-util';
import { over } from 'ramda';
import sanitizeHtml from 'sanitize-html';

import {
  checkLoggedIn,
  checkOrgMembership,
  flattenInput,
  checkDocExistence,
} from '../../../../../share/middleware';
import { getCollectionByDocType } from '../../../../../share/helpers';

const afterware = () => async (next, root, args, context) => {
  const { collections: { LessonsLearned } } = context;
  const _id = await next(root, args, context);
  const lesson = LessonsLearned.findOne({ _id });
  return { lesson };
};

const flattenLinkedTo = () => async (next, root, { linkedTo, ...args }, context) =>
  next(root, { ...args, ...linkedTo }, context);

export const resolver = async (root, args, { services: { LessonService } }) =>
  LessonService.insert(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  flattenLinkedTo(),
  checkOrgMembership(),
  checkDocExistence((root, { documentId, documentType }) => ({
    query: { _id: documentId },
    collection: getCollectionByDocType(documentType),
  })),
  checkOrgMembership(),
  async (next, root, args, context) => next(
    root,
    over(lenses.notes, sanitizeHtml, args),
    context,
  ),
  afterware(),
)(resolver);
