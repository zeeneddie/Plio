import { Template } from 'meteor/templating';

Template.RCA_Comments_Edit.viewmodel({
  comments: '',
  placeholder: 'Comments',
  onUpdate() {},
  update() {
    const { comments:completionComments } = this.getData();

    if (completionComments === this.templateInstance.data.comments) return;

    this.onUpdate({ completionComments });
  },
  getData() {
    const { comments } = this.data();
    return { comments };
  }
});
