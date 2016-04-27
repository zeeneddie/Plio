import { Template } from 'meteor/templating';

Template.ESIssueNumber.viewmodel({
  issueNumber: 1,
  getData() {
    const { issueNumber } = this.data();
    return { issueNumber };
  }
});
