import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/share/constants.js';
import { getWorkflowDefaultStepDate } from '/imports/share/helpers';

Template.Actions_CreateSubcard.viewmodel({
  mixin: ['getChildrenData', 'organization'],
  type: '',
  title: '',
  description: '',
  defaultToBeCompletedBy: '',
  autorun() {
    const data = this.getData();
    if (data && data.ownerId) {
      this.defaultToBeCompletedBy(data.ownerId);
    }
  },
  ownerId() { return Meteor.userId(); },
  planInPlace: ActionPlanOptions.NO,
  completionTargetDate() {
    const organization = this.organization();
    const linkedToVM = this.child('Actions_LinkedTo_Edit');
    const linkedTo = linkedToVM && linkedToVM.linkedTo() || [];

    return getWorkflowDefaultStepDate({ organization, linkedTo });
  },
  toBeCompletedBy() {
    return this.defaultToBeCompletedBy() || this.ownerId();
  },
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
