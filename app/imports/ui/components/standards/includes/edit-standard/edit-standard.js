import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Standards } from '/imports/api/standards/standards.js';
import { update, remove } from '/imports/api/standards/methods.js';

Template.EditStandard.viewmodel({
  share: 'standard',
  mixin: ['modal', 'organization', 'collapsing'],
  standard() {
    const _id = this._id && this._id();
    return Standards.findOne({ _id });
  },
  update({ query = {}, ...args }, options = {}, cb) {
    if (_.isFunction(options)) {
      cb = options;
      options = {};
    }

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
            swal('Removed!', `The standard "${title}" was removed succesfully.`, 'success');

            this.modal().close();
            this.selectedStandardId('');

            const standard = Standards.findOne({}, { sort: { createdAt: 1 } });

            if (!!standard) {
              this.selectedStandardId(standard._id);

              FlowRouter.go('standard', { orgSerialNumber: this.organization().serialNumber, standardId: standard._id });

              this.expandCollapsedStandard(standard._id);
            }
          }
        });
      }
    );
  }
});
