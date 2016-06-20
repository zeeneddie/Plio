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
  onUpdate() {},
  update(...args) {
    this.onUpdate(...args);
  }
});
