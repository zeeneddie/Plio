import branch from './helpers/branch';
import checkFilesAccess from './Files/checkFilesAccess';
import checkGoalsAccess from './Goal/checkGoalsAccess';
import checkRisksAccess from './Risk/checkRisksAccess';
import checkStandardsAccess from './Standard/checkStandardsAccess';
import checkNonconformitiesAccess from './Nonconformity/checkNonconformitiesAccess';
import checkPotentialGainsAccess from './Nonconformity/checkPotentialGainsAccess';
import checkMultipleOrgMembership from './Auth/checkMultipleOrgMembership';

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
