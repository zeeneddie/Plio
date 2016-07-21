import { Template } from 'meteor/templating';

import { update, remove, updateViewedBy } from '/imports/api/standards/methods.js';
import { isViewed } from '/imports/api/checkers.js';

Template.EditStandard.viewmodel({
  mixin: ['organization', 'standard', 'modal', 'callWithFocusCheck'],
  autorun() {
    const doc = this._getStandardByQuery( {_id: this.standardId()} );
    const userId = Meteor.userId();

    if (!isViewed(doc, userId)) {
      Tracker.nonreactive(() => updateViewedBy());
    }
  },
  updateViewedBy() {
    const _id = this._id();

    updateViewedBy.call({ _id });
  },
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
  }
});
