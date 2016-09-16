import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/api/constants.js';
import { insert } from '/imports/api/actions/methods.js';

Template.Actions_CreateSubcard.viewmodel({
  mixin: ['getChildrenData', 'organization', 'workflow'],
  type: '',
  title: '',
  ownerId: Meteor.userId(),
  planInPlace: ActionPlanOptions.NO,
  completionTargetDate() {
    const organization = this.organization();
    const linkedToVM = this.child('Actions_LinkedTo_Edit');
    const linkedTo = linkedToVM && linkedToVM.linkedTo() || [];

    return this.getWorkflowDefaultStepDate({ organization, linkedTo });
  },
  toBeCompletedBy: Meteor.userId(),
  verificationTargetDate: '',
  toBeVerifiedBy: '',
  linkedTo: [],
  isLinkedToEditable() {
    return !this.linkedTo().length;
  },
  getData() {
    return this.getChildrenData();
  }
});
