import { Template } from 'meteor/templating';
import { SHA256 } from 'meteor/sha';

import { Organizations } from '/imports/share/collections/organizations';
import {
  ORG_DELETE as ORG_DELETE_SWAL_PARAMS,
  ORG_DELETE_PASSWORD as ORG_DELETE_SWAL_PASSWORD_PARAMS,
} from '/imports/api/swal-params';
import { compileTemplateObject } from '/imports/api/helpers';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

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
    swal(ORG_DELETE_SWAL_PARAMS, () => {
      this._showDeleteOrgPasswordInput();
    });
  },
  _showDeleteOrgPasswordInput() {
    const { name: orgName } = this.organization() || {};
    const params = compileTemplateObject(ORG_DELETE_SWAL_PASSWORD_PARAMS, { orgName });

    swal(params, (password) => {
      if (!password) {
        swal.showInputError('Password can not be empty');
        return false;
      }

      this._deleteOrganization(password);
    });
  },
  _deleteOrganization(password) {
    const { name: orgName } = this.organization() || {};
    const organizationId = this.organizationId();
    password = SHA256(password);

    this.deleteOrganization({
      organizationId,
      password
    }, (err, res) => {
      if (err) {
        swal({
          title: 'Oops... Something went wrong!',
          text: err.reason || err,
          type: 'error',
          timer: ALERT_AUTOHIDE_TIME,
          showConfirmButton: false,
        });
      } else {
        swal({
          title: 'Success',
          text: `Organization ${orgName} has been deleted`,
          type: 'success',
          timer: ALERT_AUTOHIDE_TIME,
          showConfirmButton: false,
        });
      }

      this.afterDelete && this.afterDelete(err, res, organizationId);
    });
  }
});
