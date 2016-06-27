import { Template } from 'meteor/templating';


Template.Actions_CompletionResult.viewmodel({
  mixin: 'callWithFocusCheck',
  completionResult: '',
  enabled: true,
  update(e) {
    const { completionResult } = this.getData();
    if (completionResult === this.templateInstance.data.completionResult) {
      return;
    }

    this.callWithFocusCheck(e, () => {
      this.parent().update({ completionResult });
    });
  },
  getData() {
    return { completionResult: this.completionResult() };
  }
});
