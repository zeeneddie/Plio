import { Template } from 'meteor/templating';

import { update, remove } from '/imports/api/non-conformities/methods.js';

Template.EditNC.viewmodel({
  mixin: ['organization', 'modal', 'nonconformity', 'router', 'collapsing'],
  NC() {
    return this._getNCByQuery({ _id: this._id() });
  },
  onUpdateNotifyUserCb() {
    return this.onUpdateNotifyUser.bind(this);
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
  },
  update({ query = {}, options = {}, ...args }, cb = () => {}) {
    const _id = this._id();
    const arguments = { ...args, _id, options, query };

    console.log(arguments);

    this.modal().callMethod(update, arguments, cb);
  },
  remove() {
    const { _id, title } = this.NC();

    swal(
      {
        title: 'Are you sure?',
        text: `The non-conformity "${title}" will be removed.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: false
      },
      () => {
        this.modal().callMethod(remove, { _id }, (err) => {
          if (err) {
            swal('Ooops... Something went wrong!', err.reason, 'error');
          } else {
            swal('Removed!', `The non-conformity "${title}" was removed successfully.`, 'success');

            this.modal().close();
          }
        });
      }
    );
  }
});
