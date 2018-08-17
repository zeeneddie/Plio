import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  checkUserOrgMembership,
} from '../../../../../share/middleware';

const getOrganizationId = (root, { organizationId }) => organizationId;

export const resolver = async (root, args, { userId, services: { ActionService } }) =>
  ActionService.insert({ ...args, createdBy: userId, viewedBy: [userId] });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  checkUserOrgMembership({
    getOrganizationId,
    getUserId: (root, { ownerId }) => ownerId,
  }),
  checkUserOrgMembership({
    getOrganizationId,
    getUserId: (root, { toBeCompletedBy }) => toBeCompletedBy,
  }),
  async (next, root, args, context) => {
    const { collections: { Actions } } = context;
    const _id = await next(root, args, context);
    const action = Actions.findOne({ _id });
    return { action };
  },
)(resolver);
