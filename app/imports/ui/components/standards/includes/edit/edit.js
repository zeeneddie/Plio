import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Standards } from '/imports/api/standards/standards.js';
import { update, remove } from '/imports/api/standards/methods.js';

Template.EditStandard.viewmodel({
  share: 'standard',
  mixin: ['modal', 'organization', 'collapsing', 'standard', 'router'],
  standard() {
    const _id = this._id && this._id();
    return Standards.findOne({ _id });
  },
  onUpdateNotifyUserCb() {
    return this.onUpdateNotifyUser.bind(this);
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
  },
  update({ query = {}, options = {}, ...args }, cb) {
    const _id = this._id && this._id();
    const organizationId = this.organizationId();
    const modifier = _.extend(args, { _id, options, query, organizationId });

    this.modal().callMethod(update, modifier, cb);
  },
  remove() {
    const { _id, title } = this.standard();
    const organizationId = this.organizationId();

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
        this.modal().callMethod(remove, { _id, organizationId }, (err) => {
          if (err) {
            swal('Oops... Something went wrong!', err.reason, 'error');
          } else {
            swal('Removed!', `The standard "${title}" was removed successfully.`, 'success');

            this.modal().close();

            const query = { isDeleted: { $in: [null, false] } };
            const options = { sort: { createdAt: -1 } };

            const standard = Standards.findOne(query, options);

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
