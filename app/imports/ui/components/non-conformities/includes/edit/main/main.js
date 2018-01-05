import { Template } from 'meteor/templating';

import { WorkflowTypes, ProblemIndexes } from '/imports/share/constants.js';
import { isViewed } from '/imports/api/checkers';

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
  setStandardsUpdateComments,
} from '/imports/api/non-conformities/methods';

Template.NC_Card_Edit_Main.viewmodel({
  mixin: ['organization', 'getChildrenData'],
  onRendered(templateInstance) {
    const doc = templateInstance.data.NC;
    const userId = Meteor.userId();

    if (!isViewed(doc, userId)) {
      Meteor.defer(() => updateViewedBy.call({ _id: doc._id }));
    }
  },
  isStandardsEditable: true,
  RCAArgs({
    _id, analysis, updateOfStandards, magnitude,
  } = {}) {
    const nc = this.NC && this.NC();
    const isApprovalVisible = nc && (nc.status >= ProblemIndexes.ACTIONS_AWAITING_UPDATE);

    return {
      _id,
      analysis,
      updateOfStandards,
      magnitude,
      isApprovalVisible,
      methodRefs: this.methodRefs,
      ...(fn => fn ? { callMethod: fn } : undefined)(this.callMethod),
    };
  },
  methodRefs() {
    return {
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
      setStandardsUpdateComments,
    };
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
    return this.getChildrenData();
  },
});
