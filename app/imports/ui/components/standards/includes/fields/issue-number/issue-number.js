import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';

Template.ESIssueNumber.viewmodel({
  issueNumber: 1,
  update() {
    if (!this._id) return;
    const { issueNumber } = this.getData();
    if (!issueNumber) {
      ViewModel.findOne('ModalWindow').setError('Issue number is required!');
      return;
    }
    this.parent().update({ issueNumber });
  },
  getData() {
    const { issueNumber } = this.data();
    return { issueNumber: parseInt(issueNumber, 10) };
  }
});
