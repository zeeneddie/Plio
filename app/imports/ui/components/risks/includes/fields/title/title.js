import { Template } from 'meteor/templating';

Template.RKTitle.viewmodel({
  titleText: '',
  update(e) {
    if (!this._id) return;

    const { title } = this.getData();

    if (!title) {
      ViewModel.findOne('ModalWindow').setError('Title is required!');
      return;
    }

    this.parent().update({ title, e, withFocusCheck: true });
  },
  getData() {
    const { titleText:title } = this.data();
    return { title };
  }
});
