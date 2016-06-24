import { Template } from 'meteor/templating';

Template.Card_Edit.viewmodel({
  mixin: 'callWithFocusCheck',
  document: '',
  onUpdate() {},
  update({ query = {}, options = {}, e = {}, withFocusCheck = false, ...args }, cb = () => {}) {
    const { _id } = this.document();
    const allArgs = { ...args, _id, options, query };

    const updateFn = () => this.onUpdate(allArgs, cb);

    if (withFocusCheck) {
      this.callWithFocusCheck(e, updateFn);
    } else {
      updateFn();
    }
  },
  onRemove() {},
  remove() {
    const { _id, title } = this.document();

    swal(
      {
        title: 'Are you sure?',
        text: `The document "${title}" will be removed.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: false
      },
      () => {
        this.onRemove({ _id });
      }
    );
  }
});
