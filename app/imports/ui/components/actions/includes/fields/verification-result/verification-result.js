import { Template } from 'meteor/templating';


Template.Actions_VerificationResult.viewmodel({
  mixin: 'callWithFocusCheck',
  verificationResult: '',
  enabled: true,
  update(e) {
    const { verificationResult } = this.getData();
    if (verificationResult === this.templateInstance.data.verificationResult) {
      return;
    }

    this.parent().update && this.parent().update({ e, verificationResult, withFocusCheck: true });
  },
  getData() {
    return { verificationResult: this.verificationResult() };
  }
});
