import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkOrgMembership,
  flattenInput,
  sanitizeNotes,
  checkDocExistance,
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
  checkDocExistance(
    ({ documentId }) => ({ _id: documentId }),
    (root, { documentType }) => getCollectionByDocType(documentType),
  ),
  checkOrgMembership(),
  sanitizeNotes(),
  afterware(),
)(resolver);
