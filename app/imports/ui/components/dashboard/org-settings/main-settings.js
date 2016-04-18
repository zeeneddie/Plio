import { OrgCurrencies } from '/imports/api/constants.js';


Template.Organizations_MainSettings.viewmodel((context = {}) => {
  const { organization } = context;

  return {
    name: '',
    currency: OrgCurrencies.EUR,
    isSelectedCurrency(currency) {
      return this.currency() === currency;
    },
    currencies() {
      return _.values(OrgCurrencies);
    },
    onCreated() {
      this.load(organization);
    }
  };
});
