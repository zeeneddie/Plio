import { Template } from 'meteor/templating';
import get from 'lodash.get';
import { OrganizationSettingsHelp } from '/imports/api/help-messages.js';
import { Organizations } from '/imports/share/collections/organizations.js';
import {
  insert,
  setName,
  setTimezone,
  setDefaultCurrency,
  createOrganizationTransfer,
  cancelOrganizationTransfer,
} from '/imports/api/organizations/methods.js';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

Template.OrgSettings_MainSettings.viewmodel({
  mixin: ['modal', 'organization', 'callWithFocusCheck', 'user', 'router', 'getChildrenData'],
  name: '',
  currency: '',
  timezone: '',
  ownerId() { return Meteor.userId() },
  isEditable: false,
  nameFieldHelp: OrganizationSettingsHelp.organizationName,
  ownerFieldHelp: OrganizationSettingsHelp.organizationOwner,
  timezoneFieldHelp: OrganizationSettingsHelp.timeZone,
  currencyFieldHelp: OrganizationSettingsHelp.defaultCurrency,

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
          swal({
            title: 'Oops... Something went wrong!',
            text: err.reason,
            type: 'error',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
          });
        } else {
          swal({
            title: 'Success',
            text: 'An invitation to transfer ownership was sent successfully',
            type: 'success',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
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
          swal({
            title: 'Oops... Something went wrong!',
            text: err.reason,
            type: 'error',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
          });
        } else {
          swal({
            title: 'Success',
            text: `Transfer of the "${name}" organization was canceled`,
            type: 'success',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
          });
        }
      });
    });
  },
  getData() {
    return this.getChildrenData();
  }
});
