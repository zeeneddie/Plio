import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkOrgMembership,
  flattenInput,
  ensureCanChangeGoals,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.GoalService.insert(args, context);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkOrgMembership(),
  ensureCanChangeGoals((root, { organizationId }) => ({ organizationId })),
  async (next, root, args, context) => {
    const { collections: { Goals } } = context;
    const _id = await next(root, args, context);
    const goal = Goals.findOne({ _id });
    return { goal };
  },
)(resolver);
