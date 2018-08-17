import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkLessonAccess,
} from '../../../../../share/middleware';

const afterware = () => async (next, root, args, context) => {
  await next(root, args, context);

  const { doc: lesson } = context;

  return { lesson };
};

export const resolver = async (root, args, { services: { LessonService } }) =>
  LessonService.remove(args);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkLessonAccess(),
  afterware(),
)(resolver);
