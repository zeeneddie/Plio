import { Template } from 'meteor/templating';


Template.Actions_VerificationTargetDate.viewmodel({
  verificationTargetDate: '',
  defaultDate: true,
  placeholder: 'Verification - target date',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const date = viewmodel.getData().date || '';

    if (date === this.templateInstance.data.verificationTargetDate) {
      return;
    }

    this.verificationTargetDate(date);

    this.onUpdate && this.onUpdate({ targetDate: date });
  },
  getData() {
    return { verificationTargetDate: this.verificationTargetDate() };
  },
});
