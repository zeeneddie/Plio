import { Organizations } from '/imports/api/organizations/organizations.js';
import { setName,  setDefaultCurrency } from '/imports/api/organizations/methods.js';
import { OrgCurrencies } from '/imports/api/constants.js';


Template.OrganizationSettings_MainSettings.viewmodel({
  mixin: ['editableModalSection'],
  isSelectedCurrency(currency) {
    return this.currency() === currency;
  },
  currencies() {
    return _.values(OrgCurrencies);
  },
  updateName() {
    const name = this.name();
    const savedName = this.templateInstance.data.name;

    if (!name || name === savedName) {
      return;
    }

    const _id = this.organizationId();

    this.callMethod(setName, { _id, name });
  },
  updateCurrency(currency) {
    const current = this.currency();
    if (currency === current) {
      return;
    }

    this.currency(currency);

    const _id = this.organizationId();

    this.callMethod(setDefaultCurrency, { _id, currency });
  }
});
