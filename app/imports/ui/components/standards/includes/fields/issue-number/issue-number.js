import { Template } from 'meteor/templating';

Template.ESIssueNumber.viewmodel({
  mixin: ['modal', 'callWithFocusCheck'],
  issueNumber: 1,
  update(e) {
    if (!this._id) return;
    const { issueNumber } = this.getData();
    if (!issueNumber) {
      this.modal().setError('Issue number is required!');
      return;
    }
    this.callWithFocusCheck(e, () => {
      this.parent().update({ issueNumber });
    });
  },
  getData() {
    const { issueNumber } = this.data();
    return { issueNumber: parseInt(issueNumber, 10) };
  }
});
