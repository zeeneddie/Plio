import { Organizations } from '/imports/api/organizations/organizations.js';
import { insert, setName,  setDefaultCurrency } from '/imports/api/organizations/methods.js';
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
  updateName() {
    if (!this.organizationId || !this.organizationId()) return;

    this.callWithFocusCheck(() => {
      const name = this.name();
      const savedName = this.templateInstance.data.name;

      if (!name || name === savedName) {
        return;
      }

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

    if (!this.organizationId || !this.organizationId()) return;

    const _id = this.organizationId();

    this.modal().callMethod(setDefaultCurrency, { _id, currency });
  },
  save() {
    const { name, currency } = this.data();
    this.modal().callMethod(insert, { name, currency }, (err, _id) => {
      if (err) console.log(err);

      this.modal().close();

      const org = Organizations.findOne({ _id });

      !!org && FlowRouter.setParams({ orgSerialNumber: org.serialNumber });
    });
  }
});
