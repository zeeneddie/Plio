import { Template } from 'meteor/templating';

Template.Card_Read.viewmodel({
  cardTitle: 'Title',
  document: '',
  onRestore() {},
  onDelete() {},
  onOpenEditModal() {},
  handleMethodCall(err = '', title = '', action = 'updated', cb = () => {}) {
    if (err) {
      swal('Oops... Something went wrong!', err.reason, 'error');
    } else {
      swal('Removed!', `The document "${title}" was ${action} successfully.`, 'success');

      cb();
    }
  },
  restore({ _id, title, isDeleted, ...args }) {
    if (!isDeleted) return;

    swal(
      {
        title: 'Are you sure?',
        text: `The document "${title}" will be restored!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Restore',
        closeOnConfirm: false,
      },
      () => {
        this.onRestore({ _id, title, isDeleted, ...args }, (err, cb) => {
          this.handleMethodCall(err, title, 'restored', cb);
        });
      }
    );
  },
  delete({ _id, title, isDeleted, ...args }) {
    if (!isDeleted) return;

    swal(
      {
        title: 'Are you sure?',
        text: `The document "${title}" will be deleted permanently!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        closeOnConfirm: false,
      },
      () => {
        this.onDelete({ _id, title, isDeleted, ...args }, (err, cb) => {
          this.handleMethodCall(err, title, 'deleted', cb);
        });
      }
    );
  }
});
