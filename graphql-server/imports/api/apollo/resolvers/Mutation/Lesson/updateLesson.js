import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  checkLessonAccess,
  lessonUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.LessonService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkLessonAccess(),
  checkOrgMembership(({ organizationId }, { ownerId }) => ({
    organizationId,
    userId: ownerId,
  })),
  lessonUpdateAfterware(),
)(resolver);
