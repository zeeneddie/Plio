import checkDocsAccess from '../Document/checkDocsAccess';
import branch from '../helpers/branch';

export default () => branch(
  (root, args) => args.departmentsIds,
  checkDocsAccess((root, { departmentsIds }, context) => ({
    ids: departmentsIds,
    collection: context.collections.Departments,
  })),
);
