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
  update(...args) {
    const _id = this._id && this._id();
    if (!_id || !_.some(...args, arg => !!arg)) return;
    this.modal().callMethod(update, _.extend(...args, { _id }));
  },
  remove() {
    const _id = this.standard()._id;
    if (!confirm('Are you sure you want to delete this standard?')) return;
    this.modal().callMethod(remove, { _id }, () => {
      this.selectedStandardId('');
    });
  }
});
