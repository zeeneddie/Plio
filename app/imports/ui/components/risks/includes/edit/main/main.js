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
import { Relations } from '../../../../../../share/collections/relations';
import { WorkflowTypes, ProblemIndexes, DocumentTypes } from '../../../../../../share/constants';
import { isViewed } from '../../../../../../api/checkers';
import { AnalysisTitles } from '../../../../../../api/constants';
import { RisksHelp } from '../../../../../../api/help-messages';

Template.Risk_Card_Edit_Main.viewmodel({
  mixin: ['organization', 'getChildrenData', 'relations'],
  standardFieldHelp: RisksHelp.standards,
  departmentsFieldHelp: RisksHelp.departments,
  documentType: DocumentTypes.RISK,

  autorun() {
    Meteor.subscribe('relations', {
      rel1: { documentId: this.risk()._id },
      rel2: { documentType: DocumentTypes.STANDARD },
    });
  },

  onRendered(template) {
    const doc = template.data.risk;
    const userId = Meteor.userId();

    if (doc && !isViewed(doc, userId)) {
      Meteor.defer(() => updateViewedBy.call({ _id: doc._id }));
    }
  },
  standardsIds() {
    const relations = Relations.find().fetch();
    return relations.map(({ rel1, rel2 }) => (
      rel1.documentType === DocumentTypes.STANDARD ? rel1.documentId : rel2.documentId
    ));
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
