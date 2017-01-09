import { ReminderTypes } from './constants';

import actionCompletion from './reminder-types/action-completion';
import actionVerification from './reminder-types/action-verification';
import improvementPlanReview from './reminder-types/improvement-plan-review';
import initialRiskAnalysis from './reminder-types/initial-risk-analysis';
import rootCauseAnalysis from './reminder-types/root-cause-analysis';
import updateOfRiskRecord from './reminder-types/update-of-risk-record';
import updateOfStandards from './reminder-types/update-of-standards';


export default ReminderConfig = {

  [ReminderTypes.ROOT_CAUSE_ANALYSIS]: rootCauseAnalysis,

  [ReminderTypes.INITIAL_RISK_ANALYSIS]: initialRiskAnalysis,

  [ReminderTypes.UPDATE_OF_STANDARDS]: updateOfStandards,

  [ReminderTypes.UPDATE_OF_RISK_RECORD]: updateOfRiskRecord,

  [ReminderTypes.ACTION_COMPLETION]: actionCompletion,

  [ReminderTypes.ACTION_VERIFICATION]: actionVerification,

  [ReminderTypes.IMPROVEMENT_PLAN_REVIEW]: improvementPlanReview,

};
