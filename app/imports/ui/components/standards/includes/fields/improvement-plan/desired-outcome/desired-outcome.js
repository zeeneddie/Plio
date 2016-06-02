import { Template } from 'meteor/templating';

Template.ESIPDesiredOutcome.viewmodel({
  mixin: 'callWithFocusCheck',
  desiredOutcome: '',
  update(e) {
    this.callWithFocusCheck(e, () => {
      const { desiredOutcome } = this.getData();
      this.parent().desiredOutcome(desiredOutcome);
      this.parent().update({ desiredOutcome });
    });
  },
  getData() {
    const { desiredOutcome } = this.data();
    return { desiredOutcome };
  }
})
