import { Template } from 'meteor/templating';

Template.RCA_UOS_Edit.viewmodel({
  mixin: 'utils',
  label: 'Update of standard(s)',
  updateOfStandards: '',
  update(...args) {
    this.parent().update(...args);
  },
  onCommentsUpdate() {
    return ({ completionComments }, cb) => this.update({ 'updateOfStandards.completionComments': completionComments }, cb);
  },
  onStandardsExecutorUpdated() {
    return this.parent().updateStandardsExecutor.bind(this);
  },
  onStandardsDateUpdated() {
    return this.parent().updateStandardsDate.bind(this);
  },
  onStandardsUpdated() {
    return this.parent().updateStandards.bind(this);
  },
  onStandardsUpdateUndone() {
    return this.parent().undoStandardsUpdate.bind(this);
  }
});
