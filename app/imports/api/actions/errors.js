import { Meteor } from 'meteor/meteor';

export const ACT_CANNOT_SET_TARGET_DATE_FOR_COMPLETED = new Meteor.Error(400, 'Cannot set completion date for completed action');

export const ACT_CANNOT_SET_EXECUTOR_FOR_COMPLETED = new Meteor.Error(400, 'Cannot set completion executor for completed action');

export const ACT_CANNOT_SET_VERIFICATION_DATE_FOR_VERIFIED = new Meteor.Error(400, 'Cannot set verification date for verified action');

export const ACT_CANNOT_SET_EXECUTOR_FOR_VERIFIED = new Meteor.Error(400, 'Cannot set verification executor for verified action');

export const ACT_RK_CANNOT_BE_LINKED_TO_NC = new Meteor.Error(400, 'Risk control cannot be linked to a non-conformity');

export const ACT_PA_CANNOT_BE_LINKED_TO_RISK = new Meteor.Error(400, 'Preventative action cannot be linked to a risk');

export const ACT_ALREADY_LINKED = new Meteor.Error(400, 'This action is already linked to a specified document');
