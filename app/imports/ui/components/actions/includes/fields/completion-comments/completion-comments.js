import { Template } from 'meteor/templating';


Template.Actions_CompletionComments.viewmodel({
  mixin: 'callWithFocusCheck',
  completionComments: '',
  enabled: true,
  update(e) {
    const { completionComments } = this.getData();
    if (completionComments === this.templateInstance.data.completionComments) {
      return;
    }

    this.parent().update && this.parent().update({
      e, completionComments, withFocusCheck: true,
    });
  },
  getData() {
    return { completionComments: this.completionComments() };
  },
});
