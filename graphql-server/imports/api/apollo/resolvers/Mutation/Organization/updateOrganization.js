import { applyMiddleware } from 'plio-util';
import { pick } from 'ramda';

import {
  checkLoggedIn,
  flattenInput,
  ensureCanChangeOrgSettings,
  organizationUpdateAfterware,
  ensureUserIsPlioMember,
  branch,
  composeMiddleware,
} from '../../../../../share/middleware';

const adminFields = ['customerType', 'signupPath'];

export const resolver = async (root, args, context) =>
  context.services.OrganizationService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  branch(
    (root, args) => Object.keys(args).some(key => adminFields.includes(key)),
    composeMiddleware(
      ensureUserIsPlioMember(),
      // we only pick admin fields for safety
      async (next, root, args, context) => next(
        root,
        pick([...adminFields, '_id'], args),
        context,
      ),
    ),
    ensureCanChangeOrgSettings(((root, { _id }) => ({
      organizationId: _id,
    }))),
  ),
  organizationUpdateAfterware(),
)(resolver);
