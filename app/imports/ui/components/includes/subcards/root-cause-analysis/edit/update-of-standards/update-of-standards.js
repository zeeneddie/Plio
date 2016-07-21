import { Template } from 'meteor/templating';

Template.NC_UpdateOfStandards_Edit.viewmodel({
  autorun() {
    this.load(this.updateOfStandards());
  },
  label: 'Update of standard(s)',
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
