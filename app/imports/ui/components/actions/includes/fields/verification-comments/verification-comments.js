import { Template } from 'meteor/templating';


Template.Actions_VerificationComments.viewmodel({
  mixin: 'callWithFocusCheck',
  verificationComments: '',
  enabled: true,
  update(e) {
    const { verificationComments } = this.getData();
    if (verificationComments === this.templateInstance.data.verificationComments) {
      return;
    }

    this.parent().update && this.parent().update({
      e, verificationComments, withFocusCheck: true,
    });
  },
  getData() {
    return { verificationComments: this.verificationComments() };
  },
});
