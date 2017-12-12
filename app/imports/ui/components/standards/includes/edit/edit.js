import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';
import get from 'lodash.get';

import { update, remove, updateViewedBy } from '/imports/api/standards/methods';
import { isViewed } from '/imports/api/checkers';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

Template.EditStandard.viewmodel({
  mixin: ['organization', 'standard', 'modal', 'callWithFocusCheck', 'router', 'collapsing'],
  areActionsIsEditOnly: true,
  onRendered() {
    const doc = this._getStandardByQuery({ _id: this.standardId() });
    const userId = Meteor.userId();

    if (!isViewed(doc, userId)) {
      Tracker.nonreactive(() => this.updateViewedBy());
    }
  },
  updateViewedBy() {
    const _id = this._id();

    Meteor.defer(() => updateViewedBy.call({ _id }));
  },
  standard() {
    const _id = this._id && this._id();
    return this._getStandardByQuery({ _id });
  },
  getActionsArgs(type) {
    return {
      type,
      standardId: get(this.standard(), '_id'),
      isEditOnly: this.areActionsIsEditOnly(),
    };
  },
  _getNCsQuery() {
    return { standardsIds: this._id && this._id() };
  },
  _getRisksQuery() {
    return { standardsIds: this._id && this._id() };
  },
  onUpdateNotifyUserCb() {
    return this.onUpdateNotifyUser.bind(this);
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
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
    const { _id, title } = this.standard();

    swal({
      title: 'Are you sure?',
      text: `The standard "${title}" will be removed.`,
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
          text: `The standard "${title}" was removed successfully.`,
          type: 'success',
          timer: ALERT_AUTOHIDE_TIME,
          showConfirmButton: false,
        });

        this.modal().close();

        const list = Object.assign({}, ViewModel.findOne('StandardsList'));

        if (list) {
          const { first } = Object.assign({}, invoke(list, '_findStandardForFilter'));

          if (first) {
            const { _id } = first;

            Meteor.setTimeout(() => {
              this.goToStandard(_id);
              this.expandCollapsed(_id);
            }, 0);
          }
        }
      });
    });
  },
});
