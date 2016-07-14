import { Template } from 'meteor/templating';

Template.NC_Analysis_Edit.viewmodel({
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
  update(...args) {
    this.parent().update(...args);
  }
});
