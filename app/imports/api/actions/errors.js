import { Meteor } from 'meteor/meteor';

const { Error: E } = Meteor;

export const ACT_CANNOT_SET_TARGET_DATE_FOR_COMPLETED = new E(400, 'Cannot set completion date for completed action');

export const ACT_CANNOT_SET_EXECUTOR_FOR_COMPLETED = new E(400, 'Cannot set completion executor for completed action');

export const ACT_CANNOT_SET_VERIFICATION_DATE_FOR_VERIFIED = new E(400, 'Cannot set verification date for verified action');

export const ACT_CANNOT_SET_EXECUTOR_FOR_VERIFIED = new E(400, 'Cannot set verification executor for verified action');

export const ACT_RK_CANNOT_BE_LINKED_TO_NC = new E(400, 'Risk control cannot be linked to a nonconformity');

export const ACT_ALREADY_LINKED = new E(400, 'This action is already linked to a specified document');

export const ACT_NOT_LINKED = new E(400, 'This action is not linked to a specified document');

export const ACT_CANNOT_COMPLETE = new E(400, 'This action cannot be completed');

export const ACT_COMPLETION_CANNOT_BE_UNDONE = new E(400, 'Completion of this action cannot be undone');

export const ACT_CANNOT_VERIFY = new E(400, 'This action cannot be verified');

export const ACT_VERIFICATION_CANNOT_BE_UNDONE = new E(400, 'Verification of this action cannot be undone');

export const ACT_ANALYSIS_MUST_BE_COMPLETED = (title, sequentialId, analysisTitle) =>
  new E(400, `${analysisTitle} for ${sequentialId} "${title}" must be completed first`);
