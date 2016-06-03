import { Template } from 'meteor/templating';

Template.NCIdentifiedDate.viewmodel({
  identifiedDate: '',
  onUpdateCb() {
    this.update.bind(this);
  },
  update(viewmodel) {
    if (!this._id) return;

    const { date:identifiedDate } = viewmodel.getData();

    this.parent().update({ identifiedDate });
  },
  getData() {
    const { date:identifiedDate } = this.child('Datepicker').getData();
    return { identifiedDate };
  }
});
