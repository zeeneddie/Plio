import { Meteor } from 'meteor/meteor';

const { Error: E } = Meteor;

export const P_CANNOT_SET_EXECUTOR_FOR_COMPLETED_ANALYSIS = new E(400, 'Cannot set "Who will do it?" for completed root cause analysis');

export const P_CANNOT_SET_DATE_FOR_COMPLETED_ANALYSIS = new E(400, 'Cannot set target date for completed root cause analysis');

export const P_CANNOT_SET_COMPLETED_BY_FOR_INCOMPLETE_ANALYSIS = new E(400, 'Cannot set completed by for incomplete root cause analysis');

export const P_CANNOT_SET_COMPLETED_DATE_FOR_INCOMPLETE_ANALYSIS = new E(400, 'Cannot set completed at for incomplete root cause analysis');

export const P_CANNOT_SET_COMPLETION_COMMENTS_FOR_INCOMPLETE_ANALYSIS = new E(400, 'Cannot set completion comments for incomplete root cause analysis');


export const P_ANALYSIS_CANNOT_BE_COMPLETED = new E(400, 'This root cause analysis cannot be completed');

export const P_ANALYSIS_ALREADY_COMPLETED = new E(400, 'This root cause analysis is already completed');

export const P_ANALYSIS_CANNOT_BE_UNDONE = new E(400, 'Root cause analysis cannot be undone');

export const P_ANALYSIS_NOT_COMPLETED = new E(400, 'Root cause analysis is not completed');

export const P_STANDARDS_CANNOT_BE_UPDATED = new E(400, 'Standards cannot be updated');

export const P_STANDARDS_ALREADY_UPDATED = new E(400, 'Standards are already updated');

export const P_AT_LEAST_ONE_ACTION_MUST_BE_CREATED = new E(400, 'At least one action must be created before the update of standard(s) can be approved');

export const P_ALL_ACTIONS_MUST_BE_VERIFIED = new E(400, 'All actions must be verified as effective before the update of standard(s) can be approved');

export const P_STANDARDS_CANNOT_BE_UNDONE = new E(400, 'Approval cannot be undone');

export const P_STANDARDS_NOT_UPDATED = new E(400, 'Approval failed');

export const P_CANNOT_SET_EXECUTOR_FOR_COMPLETED_STANDARDS = new E(400, 'Cannot set "Who will do it?" for approval');

export const P_CANNOT_SET_DATE_FOR_COMPLETED_STANDARDS = new E(400, 'Cannot set target date for completed approval');

export const P_CANNOT_SET_COMPLETED_BY_FOR_INCOMPLETE_STANDARDS = new E(400, 'Cannot set completed by for incomplete approval');

export const P_CANNOT_SET_COMPLETED_DATE_FOR_INCOMPLETE_STANDARDS = new E(400, 'Cannot set completed at for incomplete approval');

export const P_CANNOT_SET_COMPLETION_COMMENTS_FOR_INCOMPLETE_STANDARDS = new E(400, 'Cannot set completion comments for incomplete approval');
