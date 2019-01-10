import {
  branch,
  checkFilesAccess,
  checkGoalsAccess,
  checkRisksAccess,
  checkStandardsAccess,
  checkNonconformitiesAccess,
  checkPotentialGainsAccess,
  checkMultipleOrgMembership,
} from './';

export const CanvasUpdateMiddlewares = [
  checkFilesAccess(),
  checkGoalsAccess(),
  checkRisksAccess(),
  checkStandardsAccess(),
  checkNonconformitiesAccess(),
  checkPotentialGainsAccess(),
  branch(
    (root, args) => args.notify,
    checkMultipleOrgMembership(({ organizationId }, { notify }) => ({
      userIds: notify,
      organizationId,
    })),
  ),
];
