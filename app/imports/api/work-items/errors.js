import { Meteor } from 'meteor/meteor';

export const WI_CANNOT_RESTORE_ASSIGNED_TO_OTHER = new Meteor.Error(400, 'This work item cannot be restored because this action was assigned to other user');
