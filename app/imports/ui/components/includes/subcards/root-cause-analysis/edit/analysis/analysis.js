import { Template } from 'meteor/templating';

Template.NC_Analysis_Edit.viewmodel({
  label: 'Root cause analysis',
  analysis: '',
  defaultTargetDate: '',
  update(...args) {
    this.parent().update(...args);
  },
  onUpdateAnalysisExecutor() {
    return this.parent().updateAnalysisExecutor.bind(this);
  },
  onAnalysisCompleted() {
    return this.parent().completeAnalysis.bind(this);
  },
  onAnalysisUndone() {
    return this.parent().undoAnalysis.bind(this);
  },
  onTargetDateUpdate() {
    return this.parent().updateAnalysisDate.bind(this);
  }
});
