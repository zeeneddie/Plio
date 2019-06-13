import { Template } from 'meteor/templating';

import { StringLimits } from '../../../../../../../../share/constants';

Template.Analysis_Comments_Edit.viewmodel({
  comments: '',
  placeholder: 'Completion comments',
  maxLength: StringLimits.comments.max,
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
