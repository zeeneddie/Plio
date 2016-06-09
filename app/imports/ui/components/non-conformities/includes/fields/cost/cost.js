import { Template } from 'meteor/templating';

import { OrgCurrencies } from '/imports/api/constants.js';

Template.NCCost.viewmodel({
  mixin: 'organization',
  onCreated() {
    if (!this.currency()) {
      const currency = this.organization().currency;
      this.load({ currency });
    }
  },
  currency: '',
  cost: '',
  update() {
    const cost = parseInt(this.cost(), 10);

    if (!cost) return;

    if (cost === this.templateInstance.data.cost) return;

    if (!this._id) return;

    this.parent().update({ cost });
  }
});
