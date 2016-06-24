import { Template } from 'meteor/templating';

Template.EditStandard.viewmodel({
  share: 'standard',
  mixin: ['organization', 'standard'],
  standard() {
    const _id = this._id && this._id();
    return this._getStandardByQuery({ _id });
  },
  _getNCsQuery() {
    return { standardId: this._id() };
  },
  onUpdateNotifyUserCb() {
    return this.onUpdateNotifyUser.bind(this);
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
  },
  update(...args) {
    this.parent().update(...args);
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
          if (err) {
            swal('Oops... Something went wrong!', err.reason, 'error');
          } else {
            swal('Removed!', `The standard "${title}" was removed successfully.`, 'success');

            this.modal().close();

            const query = { isDeleted: { $in: [null, false] } };
            const options = { sort: { createdAt: -1 } };

            const standard = this._getStandardByQuery(query, options);

            if (!!standard) {
              const { _id } = standard;

              Meteor.setTimeout(() => {
                this.goToStandard(_id);
                this.expandCollapsed(_id);
              }, 0);
            }
          }
        });
      }
    );
  }
});
