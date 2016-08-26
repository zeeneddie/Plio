import { Template } from 'meteor/templating';

Template.IP_DesiredOutcome_Edit.viewmodel({
  mixin: 'callWithFocusCheck',
  desiredOutcome: '',
  update(e) {
    this.callWithFocusCheck(e, () => {
      const { desiredOutcome } = this.getData();

      if (desiredOutcome === this.templateInstance.data.desiredOutcome) return;

      this.parent().desiredOutcome(desiredOutcome);
      this.parent().update({ 'improvementPlan.desiredOutcome': desiredOutcome });
    });
  },
  getData() {
    const { desiredOutcome } = this.data();
    return { desiredOutcome };
  }
})
