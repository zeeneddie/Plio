import { applyMiddleware } from 'plio-util';

import {
  checkLoggedIn,
  flattenInput,
  checkLessonAccess,
  lessonUpdateAfterware,
  sanitizeNotes,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { LessonService } }) =>
  LessonService.update(args);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkLessonAccess(),
  sanitizeNotes(),
  lessonUpdateAfterware(),
)(resolver);
