import { checkDocsAccess } from '../document';
import { branch } from '../helpers';

export default () => branch(
  (root, args) => args.departmentsIds,
  checkDocsAccess((root, { departmentsIds }, context) => ({
    ids: departmentsIds,
    collection: context.collections.Departments,
  })),
);
