import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';
import { update } from '/imports/api/standards/methods.js';
import { remove } from '/imports/api/standards/methods.js';

Template.EditStandard.viewmodel({
  share: 'standard',
  mixin: 'modal',
  standard() {
    const _id = this._id && this._id();
    return Standards.findOne({ _id });
  },
  update({ ...args }, cb) {
    const _id = this._id && this._id();
    this.modal().callMethod(update, _.extend(args, { _id }), cb);
  },
  remove() {
    const _id = this.standard()._id;
    if (!confirm('Are you sure you want to delete this standard?')) return;
    this.modal().callMethod(remove, { _id }, () => {
      this.selectedStandardId('');
      this.modal().destroy();
    });
  }
});
