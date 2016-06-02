import { Template } from 'meteor/templating';

Template.NCTitle.viewmodel({
  mixin: 'clearableField',
  title: '',
  update(e, viewmodel) {
    this.callWithFocusCheck(e, () => {
      if (!this._id) return;

      const { value:title } = viewmodel.getData();

      if (!title) {
        ViewModel.findOne('ModalWindow').setError('Title is required!');
        return;
      }

      this.parent().update({ title });
    });
  },
  getData() {
    const { value:title } = this.child().getData();
    return { title };
  }
});
