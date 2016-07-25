import { Template } from 'meteor/templating';

Template.Actions_QAPanel_Edit.viewmodel({
  mixin: ['modal', 'utils'],
  content: 'Actions_QAPanel_Edit_Complete',
  document: '',
  getOperation() {
    const operationType = _.last(this.content().split('_'));
    return operationType === 'Complete' ? 'Completed' : 'Verified';
  },
  update(method, { ...args }, cb = () => {}) {
    const { _id, sequentialId, title } = this.document() || {};

    const callback = (err) => {
      if (!err) {
        const operation = this.getOperation();
        if (!err) {
          swal(
            operation,
            `Action "${sequentialId} ${title}" was ${this.lowercase(operation)} successfully.`,
            'success'
          );

          this.modal().close();
        }

        cb(err);
      }
    };

    this.modal().callMethod(method, { _id, ...args }, callback);
  }
});
