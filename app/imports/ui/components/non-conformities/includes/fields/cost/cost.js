import { Template } from 'meteor/templating';

import { OrgCurrencies } from '/imports/share/constants.js';
import { NonConformitiesHelp } from '/imports/api/help-messages.js';

Template.NC_Cost_Edit.viewmodel({
  mixin: 'organization',
  onCreated() {
    if (!this.currency()) {
      const currency = this.organization().currency;
      this.load({ currency });
    }
  },
  helpMessage: NonConformitiesHelp.costPerOccurance,
  currency: '',
  cost: '',
  update(e) {
    const costInt = parseInt(this.cost(), 10);
    const cost = isNaN(costInt) ? null : costInt;

    if (cost === this.templateInstance.data.cost) return;

    if (!this._id) return;

    this.parent().update({ cost, e, withFocusCheck: true });
  },
});
