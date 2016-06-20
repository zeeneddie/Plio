import { Template } from 'meteor/templating';

Template.NCAnalysis.viewmodel({
  autorun() {
    this.load(this.analysis());
  },
  analysis: '',
  executor: '',
  defaultTargetDate: '',
  targetDate: '',
  status: '',
  completedAt: '',
  completedBy: '',
  onUpdate() {},
  update(...args) {
    this.onUpdate(...args);
  }
});
