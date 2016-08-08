import { Template } from 'meteor/templating';

import { AnalysisStatuses } from '/imports/api/constants.js';

Template.Subcards_RCA_Edit.viewmodel({
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
  completeAnalysis(...args) {
    this.parent().completeAnalysis(...args);
  },
  undoAnalysis(cb) {
    this.parent().undoAnalysis(cb);
  },
  updateStandardsExecutor(...args) {
    this.parent().updateStandardsExecutor(...args);
  },
  updateStandardsDate(...args) {
    this.parent().updateStandardsDate(...args);
  },
  updateStandards(...args) {
    this.parent().updateStandards(...args);
  },
  undoStandardsUpdate(cb) {
    this.parent().undoStandardsUpdate(cb);
  }
});
