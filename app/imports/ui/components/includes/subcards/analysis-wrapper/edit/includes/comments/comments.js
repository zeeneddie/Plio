import { Template } from 'meteor/templating';

Template.Analysis_Comments_Edit.viewmodel({
  comments: '',
  placeholder: 'Completion comments',
  onUpdate() {},
  update() {
    const { comments: completionComments } = this.getData();

    if (completionComments === this.templateInstance.data.comments) return;

    this.onUpdate({ completionComments });
  },
  getData() {
    const { comments } = this.data();
    return { comments };
  },
});
