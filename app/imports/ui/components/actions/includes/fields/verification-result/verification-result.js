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

    this.subcard && this.subcard().isWaiting(true);

    this.callWithFocusCheck(e, () => {
      this.parent().update({ verificationResult });
    });
  },
  getData() {
    return { verificationResult: this.verificationResult() };
  }
});
