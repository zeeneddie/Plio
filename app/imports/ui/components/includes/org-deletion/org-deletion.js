import { Template } from 'meteor/templating';
import { SHA256 } from 'meteor/sha';

import { Organizations } from '/imports/share/collections/organizations';


Template.OrgDeletion.viewmodel({
  mixin: 'modal',
  organizationId: '',
  deleteOrganization: null,
  beforeDelete: null,
  afterDelete: null,
  organization() {
    return Organizations.findOne({
      _id: this.organizationId()
    }, {
      fields: { name: 1 }
    });
  },
  onDeteteButtonClick(e) {
    this.beforeDelete && this.beforeDelete();
    this._showDeleteOrgWarning();
  },
  _showDeleteOrgWarning() {
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

    swal(swalInputParams, (password) => {
      if (!password) {
        swal.showInputError('Password can not be empty');
        return false;
      }

      this._deleteOrganization(password);
    });
  },
  _deleteOrganization(password) {
    const { name:orgName } = this.organization() || {};
    const organizationId = this.organizationId();
    password = SHA256(password);

    this.deleteOrganization({
      organizationId,
      password
    }, (err, res) => {
      if (err) {
        swal('Oops... Something went wrong!', err.reason || err, 'error');
      } else {
        swal('Success', `Organization ${orgName} has been deleted`, 'success');
      }

      this.afterDelete && this.afterDelete(err, res, organizationId);
    });
  }
});