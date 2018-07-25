import { DocumentTypes } from '/imports/share/constants';


export const ReminderTypes = {
  ROOT_CAUSE_ANALYSIS: 1,
  INITIAL_RISK_ANALYSIS: 2,
  UPDATE_OF_STANDARDS: 3,
  UPDATE_OF_RISK_RECORD: 4,
  ACTION_COMPLETION: 5,
  ACTION_VERIFICATION: 6,
  IMPROVEMENT_PLAN_REVIEW: 7,
  POTENTIAL_GAIN_ANALYSIS: 8,
};

export const ReminderDocTypes = {
  ...DocumentTypes,
};

export const TimeRelations = {
  BEFORE_DUE: 1,
  DUE_TODAY: 2,
  OVERDUE: 3,
};
