import { Organizations } from '/imports/api/organizations/organizations.js';
import { setName,  setDefaultCurrency } from '/imports/api/organizations/methods.js';
import { OrgCurrencies } from '/imports/api/constants.js';


Template.Organizations_MainSettings.viewmodel({
  autorun() {
    this.organization = Organizations.findOne({
      _id: this.organizationId()
    });
  },
  isSelectedCurrency(currency) {
    return this.currency() === currency;
  },
  currencies() {
    return _.values(OrgCurrencies);
  },
  updateName() {
    const name = this.name();
    const savedName = this.organization.name;

    if (!name || name === savedName) return;

    const _id = this.organizationId();

    setName.call({ _id, name }, afterUpdate);
  },
  updateCurrency(currency) {
    const current = this.currency();
    if (currency === current) return;

    this.currency(currency);

    const _id = this.organizationId();

    setDefaultCurrency.call({ _id, currency }, afterUpdate);
  },
  getData() {
    return {
      name: this.name(),
      currency: this.currency()
    };
  }
});

function afterUpdate(err) {
  if (err) {
    toastr.error('Failed to update an organization');
  }
}
