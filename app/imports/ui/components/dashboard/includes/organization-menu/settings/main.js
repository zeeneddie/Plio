import { Template } from 'meteor/templating';
import get from 'lodash.get';

import { Organizations } from '/imports/api/organizations/organizations.js';
import {
  insert,
  setName,
  setTimezone,
  setDefaultCurrency,
  createOrganizationTransfer,
  cancelOrganizationTransfer
} from '/imports/api/organizations/methods.js';


Template.OrgSettings_MainSettings.viewmodel({
  mixin: ['modal', 'organization', 'callWithFocusCheck', 'user', 'router'],
  name: '',
  currency: '',
  timezone: '',
  ownerId: Meteor.userId(),
  isEditable: false,
  updateName({ e, name }) {
    if (!this.isEditable()) return;

    this.callWithFocusCheck(e, () => {
      const _id = this.organizationId();

      this.modal().callMethod(setName, { _id, name });
    });
  },
  updateTimezone({ e, timezone }) {
    if (!this.isEditable()) return;

    const _id = this.organizationId();

    this.modal().callMethod(setTimezone, { _id, timezone });
  },
  updateCurrency({e, currency }) {
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
            text: 'An invitation to transfer ownership was sent successfully',
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
            text: `Transfer of the "${name}" organization was canceled`,
            type: 'success',
          });
        }
      });
    });
  },
  getData() {
    return this.children(vm => vm.getData)
                .reduce((prev, cur) => {
                  return { ...prev, ...cur.getData() };
                }, {});
  }
});
