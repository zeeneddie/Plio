import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  ensureCanChangeOrgSettings,
  insertAfterware,
} from '../../../../../share/middleware';
import Errors from '../../../../../share/errors';

export const resolver = async (root, args, context) =>
  context.services.ProjectService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  ensureCanChangeOrgSettings((root, { organizationId }) => ({
    organizationId,
    errorMessage: Errors.PROJECT_CREATE_NOT_AUTHORIZED,
  })),
  insertAfterware((root, args, { collections: { Projects } }) => ({
    collection: Projects,
    key: 'project',
  })),
)(resolver);
