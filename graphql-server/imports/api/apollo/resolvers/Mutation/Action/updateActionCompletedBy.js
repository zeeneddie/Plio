import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkActionAccess,
  actionUpdateAfterware,
  checkUserOrgMembership,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { ActionService } }) =>
  ActionService.set(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkActionAccess(),
  checkUserOrgMembership({
    getUserId: (root, { completedBy }) => completedBy,
  }),
  actionUpdateAfterware(),
)(resolver);
