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
  value: '',
  currencies() {
    return _.keys(OrgCurrencies);
  },
  select(currency) {
    this.currency(currency);
    this.update();
  },
  update() {
    const value = parseInt(this.value(), 10);
    const currency = this.currency();

    if (!value || !currency) return;

    if (value === this.templateInstance.data.value && currency === this.templateInstance.data.currency) return;

    if (!this._id) return;

    const cost = { value, currency };

    this.parent().update({ cost });
  }
});
