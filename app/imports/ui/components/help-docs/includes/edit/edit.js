import { Template } from 'meteor/templating';

import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';
import { HelpDocs } from '/imports/share/collections/help-docs';
import { Organizations } from '/imports/share/collections/organizations';
import { update, remove } from '/imports/api/help-docs/methods.js';

Template.HelpDocs_Edit.viewmodel({
  mixin: ['modal', 'callWithFocusCheck', 'collapsing'],
  helpDoc() {
    const _id = this._id && this._id();
    return HelpDocs.findOne({ _id });
  },
  update({
    query = {}, options = {}, e = {}, withFocusCheck = false, ...args
  }, cb = () => {}) {
    const _id = this._id();
    const allArgs = {
      ...args, _id, options, query,
    };

    const updateFn = () => this.modal().callMethod(update, allArgs, cb);

    if (withFocusCheck) {
      this.callWithFocusCheck(e, updateFn);
    } else {
      updateFn();
    }
  },
  remove() {
    const { _id, title } = this.helpDoc();

    swal({
      title: 'Are you sure?',
      text: `The help document "${title}" will be removed.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      closeOnConfirm: false,
    }, () => {
      this.modal().callMethod(remove, { _id }, (err) => {
        if (err) {
          swal.close();
          return;
        }

        swal({
          title: 'Removed!',
          text: `The help document "${title}" was removed successfully.`,
          type: 'success',
          timer: ALERT_AUTOHIDE_TIME,
          showConfirmButton: false,
        });

        this.modal().close();
      });
    });
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
  },
  membersQuery() {
    const { users } = Organizations.findOne({ isAdminOrg: true }) || {};

    const membersIds = users
      .filter(userData => !userData.isRemoved)
      .map(userData => userData.userId);

    return { _id: { $in: membersIds } };
  },
});
