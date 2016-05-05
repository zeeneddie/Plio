import { Template } from 'meteor/templating';

Template.ESIssueNumber.viewmodel({
  mixin: 'modal',
  issueNumber: 1,
  update() {
    if (!this._id) return;
    const { issueNumber } = this.getData();
    if (!issueNumber) {
      this.modal().error('Issue number is required!');
      return;
    }
    this.parent().update({ issueNumber });
  },
  getData() {
    const { issueNumber } = this.data();
    return { issueNumber: parseInt(issueNumber, 10) };
  }
});
