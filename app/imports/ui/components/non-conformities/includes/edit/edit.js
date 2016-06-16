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
    const organizationId = this.organizationId();
    const arguments = { ...args, _id, options, query, organizationId };

    console.log(arguments);

    this.modal().callMethod(update, arguments, cb);
  },
  remove() {
    const { _id, title } = this.NC();
    const organizationId = this.organizationId();

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

            const query = { isDeleted: { $in: [null, false] } };
            const options = { sort: { createdAt: -1 } };

            const NC = this._getNCByQuery(query, options);

            if (!!NC) {
              const { _id } = NC;

              Meteor.setTimeout(() => {
                this.goToNC(_id);
                this.expandCollapsed(_id);
              }, 0);
            }
          }
        });
      }
    );
  }
});
