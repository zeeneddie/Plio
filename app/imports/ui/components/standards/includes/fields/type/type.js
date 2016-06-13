import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { ViewModel } from 'meteor/manuel:viewmodel';

import { StandardTypes } from '/imports/api/standards-types/standards-types.js';

Template.ESType.viewmodel({
  share: 'standard',
  mixin: ['organization', 'collapsing', 'standard'],
  autorun() {
    // to fix bug wich randomly calls method
    if (this.typeId() !== this.templateInstance.data.typeId) {
      Tracker.nonreactive(() => this.update());
    }
  },
  typeId: '',
  types() {
    const organizationId = this.organizationId();
    const types = StandardTypes.find({ organizationId }).fetch();
    return  !this._id ? [{ _id: '', name: '' }].concat(types) : types; // add empty option
  },
  update() {
    if (!this._id) return;

    const { typeId } = this.getData();
    const modal = ViewModel.findOne('ModalWindow');

    if (!typeId) {
      modal.setError('Type is required!');
    }

    this.parent().update({ typeId }, (err) => {
      Tracker.flush();
      this.expandCollapsedStandard(this.standardId());
    });
  },
  getData() {
    const { typeId } = this.data();
    return { typeId };
  }
});
