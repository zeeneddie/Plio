import { Template } from 'meteor/templating';

Template.NC_Title_Edit.viewmodel({
  label: 'Non-conformity name',
  titleText: '',
  update(e) {
    if (!this._id) return;

    const title = this.titleText();

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
