import {
  checkFilesAccess,
  checkGoalsAccess,
  checkRisksAccess,
  checkStandardsAccess,
  checkNonconformitiesAccess,
  checkPotentialGainsAccess,
} from './';

export const CanvasUpdateMiddlewares = [
  checkFilesAccess(),
  checkGoalsAccess(),
  checkRisksAccess(),
  checkStandardsAccess(),
  checkNonconformitiesAccess(),
  checkPotentialGainsAccess(),
];
