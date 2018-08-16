import { applyMiddleware } from 'plio-util';
import checkDocExistence from './checkDocExistence';
import checkOrgMembership from '../auth/checkOrgMembership';

export default (config = () => ({})) => async (next, root, args, context) => applyMiddleware(
  checkDocExistence(config),
  // eslint-disable-next-line no-shadow
  checkOrgMembership(async (root, args, context) => ({
    organizationId: root.organizationId,
    ...await config(root, args, context),
  })),
)(next)(root, args, context);
