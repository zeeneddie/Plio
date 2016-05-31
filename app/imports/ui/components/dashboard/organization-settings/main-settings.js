import { Organizations } from '/imports/api/organizations/organizations.js';
import { setName,  setDefaultCurrency } from '/imports/api/organizations/methods.js';
import { OrgCurrencies } from '/imports/api/constants.js';


Template.OrganizationSettings_MainSettings.viewmodel({
  mixin: ['modal', 'clearableField'],
  name: '',
  currency: '',
  owner: '',
  isSelectedCurrency(currency) {
    return this.currency() === currency;
  },
  currencies() {
    return _.values(OrgCurrencies);
  },
  updateName(e) {
    const name = this.name();
    const savedName = this.templateInstance.data.name;

    if (!name || name === savedName) {
      return;
    }

    this.callWithFocusCheck(e, () => {
      const _id = this.organizationId();

      this.modal().callMethod(setName, { _id, name });
    });
  },
  updateCurrency(currency) {
    const current = this.currency();
    if (currency === current) {
      return;
    }

    this.currency(currency);

    const _id = this.organizationId();

    this.modal().callMethod(setDefaultCurrency, { _id, currency });
  }
});
