import { checkDocsAccess } from '../document';
import { branch } from '../helpers';

export default () => branch(
  (root, args) => args.riskIds,
  checkDocsAccess((root, { riskIds }, context) => ({
    ids: riskIds || [],
    collection: context.collections.Risks,
  })),
);
