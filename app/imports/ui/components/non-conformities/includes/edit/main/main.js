import { Template } from 'meteor/templating';

import { WorkflowTypes } from '/imports/api/constants.js';
import { updateViewedBy } from '/imports/api/non-conformities/methods.js';
import { isViewed } from '/imports/api/checkers.js';


Template.NC_Card_Edit_Main.viewmodel({
  mixin: 'organization',
  isStandardsEditable: true,
  onRendered(templateInstance) {
    const doc = templateInstance.data.NC;
    const userId = Meteor.userId();

    if(!isViewed(doc, userId)) {
      updateViewedBy.call({ _id: doc._id });
    }
  },
  NCGuidelines() {
    return this.organization() && this.organization().ncGuidelines;
  },
  autorun() {
    const doc = this.NC();
    const userId = Meteor.userId();

    if (!isViewed(doc, userId)) {
      Tracker.nonreactive(() => updateViewedBy());
    }
  },
  update(...args) {
    this.parent().update(...args);
  },
  showRootCauseAnalysis() {
    const NC = this.NC && this.NC();
    return NC && (NC.workflowType === WorkflowTypes.SIX_STEP);
  },
  getData() {
    return this.children(vm => vm.getData)
                .reduce((prev, cur) => {
                  return { ...prev, ...cur.getData() };
                }, {});
  }
});
