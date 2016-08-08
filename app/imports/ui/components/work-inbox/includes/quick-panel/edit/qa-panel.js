import { Template } from 'meteor/templating';

Template.WorkInbox_QAPanel_Edit.viewmodel({
  mixin: ['modal', 'utils'],
  content: 'Actions_QAPanel_Edit_Complete',
  doc: '',
  operation: 'completed',
  typeText: 'Action',
  update(method, { ...args }, cb = () => {}) {
    const { linkedDoc: { _id, type } = {} } = this.doc() || {};

    const callback = (err) => {
      if (!err) {
        swal(
          this.capitalize(this.operation()),
          `${this.typeText()} was ${this.operation()} successfully.`,
          'success'
        );

        this.modal().close();
      }
    };

    this.modal().callMethod(method, { _id, ...args }, this.chain(callback, cb));
  }
});
