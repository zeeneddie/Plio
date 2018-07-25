import { Template } from 'meteor/templating';

import { isOrgOwner } from '../../../../../api/checkers';
import { ALERT_AUTOHIDE_TIME } from '../../../../../api/constants';

Template.Card_Read.viewmodel({
  mixin: 'utils',
  cardTitle: 'Title',
  doc: '',
  isReadOnly: false,
  isDeleteBtnShown: false,
  isReady: false,
  isFullScreenMode: false,

  isOrgOwner({ organizationId }) {
    return isOrgOwner(Meteor.userId(), organizationId);
  },
  showDeleteBtn({ organizationId }) {
    return isOrgOwner(Meteor.userId(), organizationId) || !!this.isDeleteBtnShown();
  },
  onRestore() {},
  onDelete() {},
  onOpenEditModal() {},
  openModal: _.throttle(function () {
    if (ViewModel.findOne('ModalWindow')) {
      return;
    }

    this.onOpenEditModal();
  }, 1000),
  toggleScreenMode() {
    const $div = $(this.templateInstance.firstNode).closest('.content-cards-inner');
    const offset = $div.offset();
    if (this.parent().isFullScreenMode()) {
      this.parent().isFullScreenMode(false);

      setTimeout(() => {
        $div.css({
          position: 'inherit', top: 'auto', right: 'auto', bottom: 'auto', left: 'auto', transition: 'none',
        });
      }, 150);
    } else {
      $div.css({
        position: 'fixed', top: offset.top, right: $(window).width() - (offset.left + $div.outerWidth()), bottom: '0', left: offset.left,
      });

      setTimeout(() => {
        // Safari workaround
        $div.css({ transition: 'all .15s linear' });
        this.parent().isFullScreenMode(true);
      }, 100);
    }
  },
  handleMethodCall(err = '', title = '', action = 'updated', cb) {
    if (err) {
      swal({
        title: 'Oops... Something went wrong!',
        text: err.reason,
        type: 'error',
        timer: ALERT_AUTOHIDE_TIME,
        showConfirmButton: false,
      });
    } else {
      swal({
        title: this.capitalize(action),
        text: `The document "${title}" was ${action} successfully.`,
        type: 'success',
        timer: ALERT_AUTOHIDE_TIME,
        showConfirmButton: false,
      });

      return _.isFunction(cb) && cb();
    }
  },
  restore({
    _id, title, isDeleted, ...args
  }) {
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
        this.onRestore({
          _id, title, isDeleted, ...args,
        }, (err, cb) => {
          this.handleMethodCall(err, title, 'restored', cb);
        });
      },
    );
  },
  delete({
    _id, title, isDeleted, organizationId, ...args
  }) {
    if (!isDeleted || !this.isOrgOwner({ organizationId })) return;

    swal({
      title: 'Are you sure?',
      text: `The document "${title}" will be deleted permanently!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      closeOnConfirm: false,
    }, () => {
      this.onDelete({
        _id, title, isDeleted, ...args,
      }, (err, cb) => {
        this.handleMethodCall(err, title, 'deleted', cb);
      });
    });
  },
});
