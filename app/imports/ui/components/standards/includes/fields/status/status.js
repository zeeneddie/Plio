import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';

Template.ESStatus.viewmodel({
  status: 'issued',
  changeStatus(status) {
    this.status(status);
    this.update();
  },
  update() {
    if (!this._id) return;

    const { status } = this.getData();
    const modal = ViewModel.findOne('ModalWindow');

    if (!status) {
      modal.setError('Status is required!');
      return;
    }
    
    this.parent().update({ status });
  },
  getData() {
    const { status } = this.data();
    return { status };
  }
});
