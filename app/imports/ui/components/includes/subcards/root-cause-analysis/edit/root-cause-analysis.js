import { Template } from 'meteor/templating';

import { AnalysisStatuses } from '/imports/api/constants.js';

Template.Subcards_RootCauseAnalysis_Edit.viewmodel({
  mixin: ['organization', 'nonconformity', 'date'],
  defaultTargetDate() {
    const workflowDefaults = this.organization().workflowDefaults;
    const found = _.keys(workflowDefaults)
                    .find(key => this.magnitude() === key.replace('Nc', ''));
    const workflowDefault = workflowDefaults[found];
    if (workflowDefault) {
      const { timeUnit, timeValue } = workflowDefault;
      const date = moment(new Date());
      date[timeUnit](date[timeUnit]() + timeValue);
      return date.toDate();
    }
  },
  RCALabel: 'Root cause analysis',
  UOSLabel: 'Update of standard(s)',
  magnitude: '',
  analysis: '',
  updateOfStandards: '',
  isAnalysisCompleted() {
    const analysis = this.analysis();
    return analysis && analysis.status && analysis.status === parseInt(_.invert(AnalysisStatuses)['Completed'], 10);
  },
  update({ query = {}, options = {}, ...args }, cb) {
    const allArgs = { ...args, options, query };

    this.parent().update(allArgs, cb);
  },
  updateAnalysisExecutor(...args) {
    this.parent().updateAnalysisExecutor(...args);
  },
  updateAnalysisDate(...args) {
    this.parent().updateAnalysisDate(...args);
  },
  onExecutorUpdate(...args) {
    this.parent().updateExecutor(...args);
  },
  completeAnalysis() {
    this.parent().completeAnalysis();
  },
  undoAnalysis() {
    this.parent().undoAnalysis();
  },
  updateStandardsExecutor(...args) {
    this.parent().updateStandardsExecutor(...args);
  },
  updateStandardsDate(...args) {
    this.parent().updateStandardsDate(...args);
  },
  updateStandards() {
    this.parent().updateStandards();
  },
  undoStandardsUpdate() {
    this.parent().undoStandardsUpdate();
  }
});
