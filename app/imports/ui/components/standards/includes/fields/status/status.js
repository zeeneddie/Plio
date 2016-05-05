import { Template } from 'meteor/templating';

Template.ESStatus.viewmodel({
  status: 'issued',
  mixin: 'modal',
  changeStatus(status) {
    this.status(status);
    this.update();
  },
  update() {
    if (!this._id) return;
    const { status } = this.getData();
    if (!status) {
      this.modal().error('Status is required!');
      return;
    }
    this.parent().update({ status });
  },
  getData() {
    const { status } = this.data();
    return { status };
  }
});
