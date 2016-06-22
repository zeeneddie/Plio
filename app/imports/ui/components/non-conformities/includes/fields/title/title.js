import { Template } from 'meteor/templating';

Template.NCTitle.viewmodel({
  mixin: 'callWithFocusCheck',
  titleText: '',
  update(e) {
    this.callWithFocusCheck(e, () => {
      if (!this._id) return;

      const title = this.titleText();

      if (!title) {
        ViewModel.findOne('ModalWindow').setError('Title is required!');
        return;
      }

      this.parent().update({ title });
    });
  },
  getData() {
    const { titleText:title } = this.data();
    return { title };
  }
});
