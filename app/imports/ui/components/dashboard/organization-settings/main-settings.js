import { OrgCurrencies } from '/imports/api/constants.js';


Template.Organizations_MainSettings.viewmodel({
  isSelectedCurrency(currency) {
    return this.currency() === currency;
  },
  currencies() {
    return _.values(OrgCurrencies);
  },
  getData() {
    return {
      name: this.name(),
      currency: this.currency()
    };
  }
});
