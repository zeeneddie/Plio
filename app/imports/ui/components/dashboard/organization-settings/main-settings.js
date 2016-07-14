import { Organizations } from '/imports/api/organizations/organizations.js';
import {
  insert,
  setName,
  setDefaultCurrency,
  createOrganizationTransfer,
  cancelOrganizationTransfer
} from '/imports/api/organizations/methods.js';
import { OrgCurrencies } from '/imports/api/constants.js';


Template.OrganizationSettings_MainSettings.viewmodel({
  mixin: ['modal', 'organization', 'callWithFocusCheck', 'user', 'router'],
  name: '',
  currency: '',
  owner: '',
  isEditable: false,
  isSelectedCurrency(currency) {
    return this.currency() === currency;
  },
  currencies() {
    return _.values(OrgCurrencies);
  },
  updateName(e) {
    if (!this.isEditable()) return;

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

    if (!this.isEditable()) return;

    const _id = this.organizationId();

    this.modal().callMethod(setDefaultCurrency, { _id, currency });
  },
  transferOrg(newOwnerId) {
    if (!this.isEditable()) return;

    const { _id:organizationId, name } = this.organization();
    const newOwner = Meteor.users.findOne({ _id: newOwnerId });
    const newOwnerName = newOwner.fullNameOrEmail();

    swal({
      title: 'Are you sure?',
      text: `Invitation to become an owner of "${name}" organization will be sent to ${newOwnerName}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Transfer',
      closeOnConfirm: false
    }, () => {
      this.modal().callMethod(createOrganizationTransfer, {
        organizationId, newOwnerId
      }, (err) => {
        if (err) {
          swal('Oops... Something went wrong!', err.reason, 'error');
        } else {
          swal({
            title: 'Success',
            text: 'An invitation to transfer ownership is successfully sent',
            type: 'success',
          });
        }
      });
    });
  },
  cancelOrgTransfer() {
    if (!this.isEditable()) return;

    const { _id:organizationId, name } = this.organization();

    swal({
      title: 'Are you sure?',
      text: `Transfer of the "${name}" organization will be canceled`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      closeOnConfirm: false
    }, () => {
      this.modal().callMethod(cancelOrganizationTransfer, {
        organizationId
      }, (err) => {
        if (err) {
          swal('Oops... Something went wrong!', err.reason, 'error');
        } else {
          swal({
            title: 'Success',
            text: `Transfer of the "${name}" organization is canceled`,
            type: 'success',
          });
        }
      });
    });
  },
  save() {
    if (!!this.isEditable()) return;

    const { name, currency } = this.data();

    this.modal().callMethod(insert, { name, currency }, (err, _id) => {
      if (!err) {
        this.modal().close();

        const org = Organizations.findOne({ _id });

        !!org && this.goToDashboard(org.serialNumber);
      }
    });
  }
});
