import { Template } from 'meteor/templating';

Template.ESIPDesiredOutcome.viewmodel({
  desiredOutcome: '',
  update() {
    const { desiredOutcome } = this.getData();
    this.parent().update({ desiredOutcome });
  },
  getData() {
    const { desiredOutcome } = this.data();
    return { desiredOutcome };
  }
})
