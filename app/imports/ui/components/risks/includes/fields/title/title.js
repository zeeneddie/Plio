import { Template } from 'meteor/templating';

Template.RKTitle.viewmodel({
  mixin: 'clearableField',
  title: '',
  update(e) {
    this.callWithFocusCheck(e, () => {
      const { title } = this.getData();

      if (!this._id) return;

      if (!title) {
        ViewModel.findOne('ModalWindow').setError('Title is required!');
        return;
      }

      this.parent().update({ title, nestingLevel });
    });
  },
  getData() {
    const { title } = this.data();
    return { title };
  }
});
