import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { deleteOrganization } from '/imports/api/organizations/methods';


Template.OrgSettings_OrgDeletion.viewmodel({
  mixin: 'modal',
  organizationId: '',
  deleteOrganization({ organizationId, password }, cb) {
    deleteOrganization.call({ organizationId, ownerPassword: password }, cb);
  },
  deleteOrganizationFn() {
    return this.deleteOrganization.bind(this);
  },
  beforeDelete() {
    this.modal().close();
  },
  beforeDeleteFn() {
    return this.beforeDelete.bind(this);
  },
  afterDelete(err) {
    if (!err) {
      FlowRouter.go('home');
    }
  },
  afterDeleteFn() {
    return this.afterDelete.bind(this);
  }
});
