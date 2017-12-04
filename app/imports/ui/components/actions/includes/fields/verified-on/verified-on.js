import { Template } from 'meteor/templating';


Template.Actions_VerifiedOn.viewmodel({
  verifiedAt: '',
  defaultDate: false,
  placeholder: 'Verified as effective on',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const date = viewmodel.getData().date || '';

    if (date === this.templateInstance.data.verifiedAt) {
      return;
    }

    this.verifiedAt(date);

    this.parent().update && this.parent().update({ verifiedAt: date });
  },
  getData() {
    return { verifiedAt: this.verifiedAt() };
  },
});
