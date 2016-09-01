import { Template } from 'meteor/templating';

import { WorkflowTypes } from '/imports/api/constants.js';
import { isViewed } from '/imports/api/checkers.js';


import {
  updateViewedBy,
  setAnalysisExecutor,
  setAnalysisDate,
  completeAnalysis,
  undoAnalysis,
  setStandardsUpdateExecutor,
  setStandardsUpdateDate,
  updateStandards,
  undoStandardsUpdate,
  setAnalysisCompletedBy,
  setAnalysisCompletedDate,
  setAnalysisComments,
  setStandardsUpdateCompletedBy,
  setStandardsUpdateCompletedDate,
  setStandardsUpdateComments
} from '/imports/api/non-conformities/methods.js';

Template.NC_Card_Edit_Main.viewmodel({
  mixin: 'organization',
  onRendered(templateInstance) {
    const doc = templateInstance.data.NC;
    const userId = Meteor.userId();

    if (!isViewed(doc, userId)) {
      updateViewedBy.call({ _id: doc._id });
    }
  },
  isStandardsEditable: true,
  getMethodRefs() {
    return () => ({
      setAnalysisExecutor,
      setAnalysisDate,
      completeAnalysis,
      undoAnalysis,
      setStandardsUpdateExecutor,
      setStandardsUpdateDate,
      updateStandards,
      undoStandardsUpdate,
      setAnalysisCompletedBy,
      setAnalysisCompletedDate,
      setAnalysisComments,
      setStandardsUpdateCompletedBy,
      setStandardsUpdateCompletedDate,
      setStandardsUpdateComments
    });
  },
  showRootCauseAnalysis() {
    const NC = this.NC && this.NC();
    return NC && (NC.workflowType === WorkflowTypes.SIX_STEP);
  },
  NCGuidelines() {
    return this.organization() && this.organization().ncGuidelines;
  },
  update(...args) {
    this.parent().update(...args);
  },
  getData() {
    return this.children(vm => vm.getData)
                .reduce((prev, cur) => {
                  return { ...prev, ...cur.getData() };
                }, {});
  }
});
