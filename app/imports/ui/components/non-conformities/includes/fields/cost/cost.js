import { Template } from 'meteor/templating';

import { OrgCurrencies } from '/imports/api/constants.js';

Template.NCCost.viewmodel({
  mixin: ['organization', 'callWithFocusCheck'],
  onCreated() {
    if (!this.currency()) {
      const currency = this.organization().currency;
      this.load({ currency });
    }
  },
  currency: '',
  cost: '',
  update(e) {
    this.callWithFocusCheck(e, () => {
      const costInt = parseInt(this.cost(), 10);
      const cost = isNaN(costInt) ? null : costInt;

      if (cost === this.templateInstance.data.cost) return;

      if (!this._id) return;

      this.parent().update({ cost });
    });
  }
});
