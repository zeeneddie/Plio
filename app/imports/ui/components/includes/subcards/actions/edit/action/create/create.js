import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/share/constants.js';
import { insert } from '/imports/api/actions/methods';
import { getWorkflowDefaultStepDate } from '/imports/share/helpers.js';

Template.Actions_CreateSubcard.viewmodel({
  mixin: ['getChildrenData', 'organization'],
  type: '',
  title: '',
  description: '',
<<<<<<< HEAD
  ownerId() { return Meteor.userId(); },
=======
  defaultToBeCompletedBy:'',
  autorun() {
    const data = this.getData();
    if (data && data.ownerId) {
      this.defaultToBeCompletedBy(data.ownerId);
    }
  },
  ownerId() { return Meteor.userId() },
>>>>>>> d9bedfa586277a878b2e425b1cdf3771f9696b17
  planInPlace: ActionPlanOptions.NO,
  completionTargetDate() {
    const organization = this.organization();
    const linkedToVM = this.child('Actions_LinkedTo_Edit');
    const linkedTo = linkedToVM && linkedToVM.linkedTo() || [];

    return getWorkflowDefaultStepDate({ organization, linkedTo });
  },
<<<<<<< HEAD
  toBeCompletedBy() { return Meteor.userId(); },
=======
  toBeCompletedBy() {
    return this.defaultToBeCompletedBy() || this.ownerId();
  },
>>>>>>> d9bedfa586277a878b2e425b1cdf3771f9696b17
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
