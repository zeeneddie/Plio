import { OrgCurrencies } from '/imports/api/constants.js';


Template.Organizations_MainSettings.helpers({
  currencies() {
    return _.map(OrgCurrencies, (name, key) => {
      return {name, key};
    });
  },
  isOrgCurrency() {
    return this.name === Template.parentData().currency;
  }
});
