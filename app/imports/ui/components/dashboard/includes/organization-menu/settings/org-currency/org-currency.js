import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { OrgCurrencies } from '/imports/share/constants.js';


Template.OrgSettings_OrgCurrency.viewmodel({
  currency: '',
  isSelectedCurrency(currency) {
    return this.currency() === currency;
  },
  currencies() {
    return _.values(OrgCurrencies);
  },
  update(e) {
    const currency = Blaze.getData(e.target);

    if (currency === this.templateInstance.data.currency) {
      return;
    }

    this.currency(currency);

    this.parent().updateCurrency && this.parent().updateCurrency({ e, currency });
  },
  getData() {
    return { currency: this.currency() };
  },
});
