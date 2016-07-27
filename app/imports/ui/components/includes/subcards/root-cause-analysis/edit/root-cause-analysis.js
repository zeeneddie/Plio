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
  updateAnalysisDate(...args) {
    this.parent().updateAnalysisDate(...args);
  },
  completeAnalysis(cb) {
    this.parent().completeAnalysis(cb);
  },
  undoAnalysis(cb) {
    this.parent().undoAnalysis(cb);
  },
  updateStandardsDate(...args) {
    this.parent().updateStandardsDate(...args);
  },
  updateStandards(cb) {
    this.parent().updateStandards(cb);
  },
  undoStandardsUpdate(cb) {
    this.parent().undoStandardsUpdate(cb);
  }
});
