import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { userId, services: { ActionService } }) =>
  ActionService.insert({ ...args, createdBy: userId, viewedBy: [userId] });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  checkOrgMembership((root, { ownerId }) => ({ userId: ownerId })),
  checkOrgMembership((root, { toBeCompletedBy }) => ({ userId: toBeCompletedBy })),
  async (next, root, args, context) => {
    const { collections: { Actions } } = context;
    const _id = await next(root, args, context);
    const action = Actions.findOne({ _id });
    return { action };
  },
)(resolver);
