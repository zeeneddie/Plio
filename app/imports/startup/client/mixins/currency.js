import { OrgCurrencies } from '/imports/share/constants.js';

export default {
  getCurrencySymbol(currency) {
    switch (currency) {
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'USD':
        return '$';
      default:
        return '$';
    }
  },
  currencies() {
    return _.values(OrgCurrencies).map(c => ({ [c]: this.getCurrencySymbol(c) }));
  },
};
