import { Template } from 'meteor/templating';

Template.NCUpdateOfStandards.viewmodel({
  autorun() {
    this.load(this.updateOfStandards());
  },
  updateOfStandards: '',
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
