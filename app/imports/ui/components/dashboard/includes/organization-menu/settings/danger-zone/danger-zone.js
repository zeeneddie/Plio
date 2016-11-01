import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { SHA256 } from 'meteor/sha';

import { Organizations } from '/imports/share/collections/organizations';
import { deleteOrganization } from '/imports/api/organizations/methods';


Template.OrgSettings_DangerZone.viewmodel({
  mixin: 'modal',
  label: 'Danger zone',
  organizationId: '',
  organization() {
    return Organizations.findOne({
      _id: this.organizationId()
    }, {
      fields: { name: 1 }
    });
  },
  deleteOrganization() {
    this._showDeleteOrgWarning();
  },
  deleteOrganizationFn() {
    return this.deleteOrganization.bind(this);
  },
  _showDeleteOrgWarning() {
    this.modal().close();

    const swalWarningParams = {
      title: 'Are you sure?',
      text: 'Deleting a Plio organization will delete all records linked to that organization. ' +
        'Deleting is an irreversible action and you will not be able to recover this data afterwards. ' +
        'Do you still want to go ahead and delete?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      closeOnConfirm: false,
      confirmButtonClass: 'btn-md btn-danger'
    };

    swal(swalWarningParams, () => {
      this._showDeleteOrgPasswordInput();
    });
  },
  _showDeleteOrgPasswordInput() {
    const { name:orgName } = this.organization() || {};

    const swalInputParams = {
      title: `Confirm deletion of ${orgName} organization`,
      text: 'Enter your password:',
      type: 'input',
      inputType: 'password',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      closeOnConfirm: false,
      showLoaderOnConfirm: true
    };

    swal(swalInputParams, (ownerPassword) => {
      if (!ownerPassword) {
        swal.showInputError('Password can not be empty');
        return false;
      }

      this._deleteOrganization(ownerPassword);
    });
  },
  _deleteOrganization(ownerPassword) {
    const { name:orgName } = this.organization() || {};
    ownerPassword = SHA256(ownerPassword);

    deleteOrganization.call({
      organizationId: this.organizationId(),
      ownerPassword
    }, (err, res) => {
      if (err) {
        swal('Oops... Something went wrong!', err.reason || err, 'error');
      } else {
        swal('Success', `Organization ${orgName} has been deleted`, 'success');
        FlowRouter.go('home');
      }
    });
  }
});
