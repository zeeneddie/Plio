import { Template } from 'meteor/templating';

import { AnalysisStatuses } from '/imports/api/constants.js';

Template.NCRootCauseAnalysis.viewmodel({
  mixin: ['organization', 'nonconformity', 'date'],
  defaultTargetDate() {
    const workflowDefaults = this.organization().workflowDefaults;
    const found = _.keys(workflowDefaults)
                    .find(key => this.currentNC().magnitude === key.replace('Nc', ''));
    const workflowDefault = workflowDefaults[found];
    if (workflowDefault) {
      const { timeUnit, timeValue } = workflowDefault;
      const date = moment(new Date());
      date[timeUnit](date[timeUnit]() + timeValue);
      return date.toDate();
    }
  },
  analysis: '',
  updateOfStandards: '',
  isAnalysisCompleted() {
    const analysis = this.analysis();
    return analysis && analysis.status && analysis.status === parseInt(_.invert(AnalysisStatuses)['Completed'], 10);
  }
});
