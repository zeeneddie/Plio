import { Template } from 'meteor/templating';

Template.NCTitle.viewmodel({
  titleText: '',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    if (!this._id) return;

    const { value:title } = viewmodel.getData();

    if (!title) {
      ViewModel.findOne('ModalWindow').setError('Title is required!');
      return;
    }

    this.parent().update({ title });
  },
  getData() {
    const { value:title } = this.child('InputField').getData();
    return { title };
  }
});
