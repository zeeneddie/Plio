import { OrgCurrencies } from '/imports/api/constants.js';


Template.Organizations_MainSettings.viewmodel((context = {}) => {
  const defaultName = '';
  const defaultCurrency = OrgCurrencies.EUR;

  const {
    name = defaultName,
    currency = defaultCurrency
  } = context;

  return {
    name: defaultName,
    currency: defaultCurrency,
    isSelectedCurrency(currency) {
      return this.currency() === currency;
    },
    currencies() {
      return _.values(OrgCurrencies);
    },
    onCreated() {
      this.load({ name, currency });
    },
    getData() {
      return {
        name: this.name(),
        currency: this.currency()
      };
    }
  };
});
