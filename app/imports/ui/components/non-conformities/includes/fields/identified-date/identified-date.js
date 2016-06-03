import { Template } from 'meteor/templating';

Template.NCIdentifiedDate.viewmodel({
  identifiedAt: '',
  onUpdateCb() {
    this.update.bind(this);
  },
  update(viewmodel) {
    if (!this._id) return;

    const { date:identifiedAt } = viewmodel.getData();

    this.parent().update({ identifiedAt });
  },
  getData() {
    const { date:identifiedAt } = this.child('Datepicker').getData();
    return { identifiedAt };
  }
});
