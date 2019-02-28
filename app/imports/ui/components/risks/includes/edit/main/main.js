import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

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
} from '/imports/api/risks/methods';
import { WorkflowTypes, ProblemIndexes } from '/imports/share/constants.js';
import { isViewed } from '/imports/api/checkers';
import { AnalysisTitles } from '/imports/api/constants.js';
import { RisksHelp } from '/imports/api/help-messages';

Template.Risk_Card_Edit_Main.viewmodel({
  mixin: ['organization', 'getChildrenData'],
  standardFieldHelp: RisksHelp.standards,
  departmentsFieldHelp: RisksHelp.departments,

  autorun() {
    console.log('autorun');
  },

  onRendered(template) {
    const doc = template.data.risk;
    const userId = Meteor.userId();

    if (doc && !isViewed(doc, userId)) {
      Meteor.defer(() => updateViewedBy.call({ _id: doc._id }));
    }
  },
  RKGuidelines() {
    return this.organization() && this.organization().rkGuidelines;
  },
  update(...args) {
    this.parent().update(...args);
  },
  RCAArgs({
    _id, analysis, updateOfStandards, magnitude,
  } = {}) {
    const risk = this.risk && this.risk();
    const isApprovalVisible = risk && (risk.status >= ProblemIndexes.ACTIONS_AWAITING_UPDATE);

    return {
      _id,
      analysis,
      updateOfStandards,
      magnitude,
      isApprovalVisible,
      methodRefs: this.methodRefs,
      RCALabel: AnalysisTitles.riskAnalysis,
      UOSLabel: AnalysisTitles.updateOfRiskRecord,
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
    const risk = this.risk && this.risk();
    return risk && (risk.workflowType === WorkflowTypes.SIX_STEP);
  },
  showApproval() {
    const risk = this.risk && this.risk();
    return risk && (risk.status === ProblemIndexes.ACTIONS_VERIFIED_STANDARDS_REVIEWED);
  },
  getData() {
    return this.getChildrenData();
  },
});
