import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/share/constants.js';
import { insert } from '/imports/api/actions/methods';
import { getWorkflowDefaultStepDate } from '/imports/share/helpers.js';

Template.Actions_CreateSubcard.viewmodel({
  mixin: ['getChildrenData', 'organization'],
  type: '',
  title: '',
  description: '',
  ownerId() { return Meteor.userId(); },
  planInPlace: ActionPlanOptions.NO,
  completionTargetDate() {
    const organization = this.organization();
    const linkedToVM = this.child('Actions_LinkedTo_Edit');
    const linkedTo = linkedToVM && linkedToVM.linkedTo() || [];

    return getWorkflowDefaultStepDate({ organization, linkedTo });
  },
  toBeCompletedBy() { return Meteor.userId(); },
  verificationTargetDate: '',
  toBeVerifiedBy: '',
  linkedTo: [],
  isLinkedToEditable() {
    return !this.linkedTo().length;
  },
  getData() {
    return this.getChildrenData();
  },
});
