import { Organizations } from '/imports/api/organizations/organizations.js';
import {
  setName,
  setDefaultCurrency,
  transferOrganization
} from '/imports/api/organizations/methods.js';
import { OrgCurrencies } from '/imports/api/constants.js';


Template.OrganizationSettings_MainSettings.viewmodel({
  mixin: ['modal', 'organization', 'clearableField'],
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

    const _id = this.organizationId();

    this.modal().callMethod(setDefaultCurrency, { _id, currency });
  },
  transferOrg(newOwmerId) {
    const { _id:organizationId, name } = this.organization();

    const newOwner = Meteor.users.findOne({ _id: newOwmerId });
    const newOwnerName = newOwner.fullNameOrEmail();

    swal({
      title: 'Are you sure?',
      text: `Ownership of the organization "${name}" will be transfered to ${newOwnerName}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Transfer',
      closeOnConfirm: false
    }, () => {
      this.modal().callMethod(transferOrganization, {
        organizationId, newOwmerId
      }, (err) => {
        if (err) {
          return;
        }

        swal({
          title: 'Success',
          text: 'Ownership succesfully transfered',
          type: 'success',
        }, () => {
          this.modal().close();
        });
      });
    });
  }
});
