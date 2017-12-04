import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { ViewModel } from 'meteor/manuel:viewmodel';

import { RiskTypes } from '/imports/share/collections/risk-types.js';

Template.Risks_Type_Edit.viewmodel({
  mixin: ['organization', 'collapsing', 'risk'],
  autorun() {
    // to fix bug wich randomly calls method
    if (this.typeId() !== this.templateInstance.data.typeId) {
      Tracker.nonreactive(() => this.update());
    }
  },
  onCreated() {
    const types = this.types();

    if (!this.typeId() && types.length > 0) {
      this.typeId(types[0]._id);
    }
  },
  typeId: '',
  types() {
    const organizationId = this.organizationId();
    return RiskTypes.find({ organizationId }).fetch();
  },
  update() {
    if (!this._id) return;

    const { typeId } = this.getData();

    if (!typeId) {
      ViewModel.findOne('ModalWindow').setError('Type is required!');
    }

    this.parent().update({ typeId }, err =>
      Tracker.afterFlush(() =>
        this.expandCollapsed(this.riskId())));
  },
  getData() {
    const { typeId } = this.data();
    return { typeId };
  },
});
