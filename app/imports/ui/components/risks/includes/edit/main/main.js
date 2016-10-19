import { Template } from 'meteor/templating';

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
} from '/imports/api/risks/methods.js';
import { WorkflowTypes } from '/imports/share/constants.js';
import { isViewed } from '/imports/api/checkers.js';

Template.Risk_Card_Edit_Main.viewmodel({
  mixin: ['organization', 'getChildrenData'],
  onRendered(template) {
    const doc = template.data.risk;
    const userId = Meteor.userId();

    if (doc && !isViewed(doc, userId)) {
      updateViewedBy.call({ _id: doc._id });
    }
  },
  RKGuidelines() {
    return this.organization() && this.organization().rkGuidelines;
  },
  update(...args) {
    this.parent().update(...args);
  },
  RCAArgs({ _id, analysis, updateOfStandards, magnitude } = {}) {
    return {
      _id,
      analysis,
      updateOfStandards,
      magnitude,
      methodRefs: this.methodRefs,
      ...(fn => fn ? { callMethod: fn } : undefined)(this.callMethod)
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
      setStandardsUpdateComments
    };
  },
  showRootCauseAnalysis() {
    const risk = this.risk && this.risk();
    return risk && (risk.workflowType === WorkflowTypes.SIX_STEP);
  },
  getData() {
    return this.getChildrenData();
  }
});
