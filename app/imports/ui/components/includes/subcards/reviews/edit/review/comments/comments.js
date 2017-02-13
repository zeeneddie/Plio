import { Template } from 'meteor/templating';

Template.Review_Comments.viewmodel({
  label: 'Comments',
  placeholder: 'Comments',
  comments: '',
  onUpdate() {
    const { comments } = this.data();
    this.parent().update({
      comments: comments.length ? comments : undefined,
    });
  },
});
