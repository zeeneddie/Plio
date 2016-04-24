import { Organizations } from '/imports/api/organizations/organizations.js';
import { setName,  setDefaultCurrency } from '/imports/api/organizations/methods.js';
import { OrgCurrencies } from '/imports/api/constants.js';


Template.OrganizationSettings_MainSettings.viewmodel({
  isSelectedCurrency(currency) {
    return this.currency() === currency;
  },
  currencies() {
    return _.values(OrgCurrencies);
  },
  updateName() {
    const name = this.name();
    const savedName = this.templateInstance.data.name;

    if (!name || name === savedName) return;

    const _id = this.organizationId();

    this.setSavingState(true);

    setName.call({ _id, name }, (err) => {
      this.setSavingState(false);  

      if (err) {
        toastr.error('Failed to update a name');
      }
    });
  },
  updateCurrency(currency) {
    const current = this.currency();
    if (currency === current) return;

    this.currency(currency);

    const _id = this.organizationId();

    this.setSavingState(true);

    setDefaultCurrency.call({ _id, currency }, (err) => {
      this.setSavingState(false);

      if (err) {
        toastr.error('Failed to update default currency');
      }
    });
  }
});
