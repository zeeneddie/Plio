import { Template } from 'meteor/templating';

import { NonConformitiesHelp, PotentialGainsHelp } from '../../../../../../api/help-messages.js';

Template.NC_Cost_Edit.viewmodel({
  mixin: ['organization', 'nonconformity'],
  onCreated() {
    if (!this.currency()) {
      this.load({ currency: this.organization().currency });
    }
  },
  currency: '',
  cost: '',
  helpMessage() {
    return this.isPG(this.data())
      ? PotentialGainsHelp.costPerOccurance
      : NonConformitiesHelp.costPerOccurance;
  },
  update(e) {
    const costInt = parseInt(this.cost(), 10);
    // eslint-disable-next-line no-restricted-globals
    const cost = isNaN(costInt) ? null : costInt;

    if (cost === this.templateInstance.data.cost) return;

    if (!this._id) return;

    this.parent().update({ cost, e, withFocusCheck: true });
  },
});
