import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { ViewModel } from 'meteor/manuel:viewmodel';

import { RiskTypes } from '/imports/api/risk-types/risk-types.js';

Template.RKType.viewmodel({
  mixin: ['organization', 'collapsing', 'risk'],
  autorun() {
    // to fix bug wich randomly calls method
    if (this.typeId() !== this.templateInstance.data.typeId) {
      Tracker.nonreactive(() => this.update());
    }
  },
  typeId: '',
  types() {
    const organizationId = this.organizationId();
    const types = RiskTypes.find({ organizationId }).fetch();
    return  !this._id ? [{ _id: '', title: '' }].concat(types) : types; // add empty option
  },
  update() {
    if (!this._id) return;

    const { typeId } = this.getData();

    if (!typeId) {
      ViewModel.findOne('ModalWindow').setError('Type is required!');
    }

    this.parent().update({ typeId }, (err) => {
      Tracker.flush();
      this.expandCollapsed(this.riskId());
    });
  },
  getData() {
    const { typeId } = this.data();
    return { typeId };
  }
});
