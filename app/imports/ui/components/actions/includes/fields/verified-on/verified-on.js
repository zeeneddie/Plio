import { Template } from 'meteor/templating';


Template.Actions_VerifiedOn.viewmodel({
  verifiedAt: '',
  startDate: new Date(),
  defaultDate: false,
  placeholder: 'Verified as effective on',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { date } = viewmodel.getData();

    if (date === this.templateInstance.data.verifiedAt) {
      return;
    }

    this.verifiedAt(date);

    this.parent().update({ verifiedAt: date });
  },
  getData() {
    return { verifiedAt: this.verifiedAt() };
  }
});
