import { Template } from 'meteor/templating';

import { isOrgOwner } from '/imports/api/checkers.js';

Template.Card_Read.viewmodel({
  mixin: 'utils',
  cardTitle: 'Title',
  doc: '',
  isReadOnly: false,
  isDeleteBtnShown: false,
  isOrgOwner({ organizationId }) {
    return isOrgOwner(Meteor.userId(), organizationId);
  },
  showDeleteBtn({ organizationId }) {
    return isOrgOwner(Meteor.userId(), organizationId) || !!this.isDeleteBtnShown();
  },
  onRestore() {},
  onDelete() {},
  onOpenEditModal() {},
  openModal: _.throttle(function() {
    if (ViewModel.findOne('ModalWindow')) {
      return;
    }

    this.onOpenEditModal();
  }, 1000),
  handleMethodCall(err = '', title = '', action = 'updated', cb) {
    if (err) {
      console.log(err);
      swal('Oops... Something went wrong!', err.reason, 'error');
    } else {
      swal(this.capitalize(action), `The document "${title}" was ${action} successfully.`, 'success');

      return _.isFunction(cb) && cb();
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
  delete({ _id, title, isDeleted, organizationId, ...args }) {
    if (!isDeleted || !this.isOrgOwner({ organizationId })) return;

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
