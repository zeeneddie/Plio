import { Template } from 'meteor/templating';

Template.RiskEvaluation_Comments_Edit.viewmodel({
  comments: '',
  update() {
    const { comments } = this.getData();

    if (this.templateInstance.data.comments === comments) return;

    this.parent().update({ comments });
  },
  getData() {
    const { comments } = this.data();
    return { comments };
  },
});
