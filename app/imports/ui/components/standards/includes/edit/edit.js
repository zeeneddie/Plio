import { Template } from 'meteor/templating';

import { update, remove } from '/imports/api/standards/methods.js';

Template.EditStandard.viewmodel({
  mixin: ['organization', 'standard', 'modal', 'callWithFocusCheck'],
  standard() {
    const _id = this._id && this._id();
    return this._getStandardByQuery({ _id });
  },
  _getNCsQuery() {
    return { standardsIds: this._id && this._id() };
  },
  onUpdateNotifyUserCb() {
    return this.onUpdateNotifyUser.bind(this);
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
  },
  update({ query = {}, options = {}, e = {}, withFocusCheck = false, ...args }, cb = () => {}) {
    const _id = this._id();
    const allArgs = { ...args, _id, options, query };

    const updateFn = () => this.modal().callMethod(update, allArgs, cb);

    if (withFocusCheck) {
      this.callWithFocusCheck(e, updateFn);
    } else {
      updateFn();
    }
  },
  remove() {
    const { _id, title } = this.standard();

    swal(
      {
        title: 'Are you sure?',
        text: `The standard "${title}" will be removed.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: false
      },
      () => {
        this.modal().callMethod(remove, { _id }, (err) => {
          if (err) return;

          swal('Removed!', `The standard "${title}" was removed successfully.`, 'success');

          this.modal().close();
        });
      }
    );
  },
  standardsIds() {
    return [this.standard()._id];
  }
});
