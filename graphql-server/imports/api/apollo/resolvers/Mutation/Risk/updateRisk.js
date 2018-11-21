import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkRiskAccess,
  riskUpdateAfterware,
  checkStandardsAccess,
  checkDepartmentsAccess,
  checkOrgMembership,
  branch,
  checkRiskTypeAccess,
  composeMiddleware,
  ensureIsAnalysisOwner,
  checkProjectsAccess,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.RiskService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkRiskAccess(),
  checkStandardsAccess(),
  checkDepartmentsAccess(),
  checkProjectsAccess(),
  branch(
    (root, args) => args.ownerId,
    checkOrgMembership(({ organizationId }, { ownerId }) => ({
      organizationId,
      userId: ownerId,
    })),
  ),
  branch(
    (root, args) => args.originatorId,
    checkOrgMembership(({ organizationId }, { originatorId }) => ({
      organizationId,
      userId: originatorId,
    })),
  ),
  branch(
    (root, args) => args.typeId,
    checkRiskTypeAccess((root, { typeId }) => ({
      query: { _id: typeId },
    })),
  ),
  branch(
    (root, args) => args.analysis,
    composeMiddleware(
      branch(
        (root, args) => args.analysis.executor,
        checkOrgMembership(({ organizationId }, { analysis }) => ({
          organizationId,
          userId: analysis.executor,
        })),
      ),
      branch(
        (root, args) => args.analysis.completedAt,
        ensureIsAnalysisOwner(),
      ),
      branch(
        (root, args) => args.analysis.completedBy,
        checkOrgMembership(({ organizationId }, { analysis }) => ({
          organizationId,
          userId: analysis.completedBy,
        })),
      ),
      branch(
        (root, args) => args.analysis.assignedBy,
        checkOrgMembership(({ organizationId }, { analysis }) => ({
          organizationId,
          userId: analysis.assignedBy,
        })),
      ),
    ),
  ),
  riskUpdateAfterware(),
)(resolver);
