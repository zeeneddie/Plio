import { Template } from 'meteor/templating';

Template.RCA_Analysis_Edit.viewmodel({
  mixin: 'utils',
  label: 'Root cause analysis',
  analysis: '',
  defaultTargetDate: '',
  update(...args) {
    this.parent().update(...args);
  },
  onCommentsUpdate() {
    return ({ completionComments }, cb) => this.update({ 'analysis.completionComments': completionComments }, cb);
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
