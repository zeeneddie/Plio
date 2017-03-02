import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import { deleteOrganization } from '/imports/api/organizations/methods';


Template.OrgSettings_OrgDeletion.viewmodel({
  mixin: 'modal',
  organizationId: '',
  deleteOrganization({ organizationId, password }, cb) {
    deleteOrganization.call({ organizationId, ownerPassword: password }, cb);
  },
  afterDelete(err) {
    if (!err) {
      this.modal().close();
      Meteor.defer(() => FlowRouter.go('hello'));
    }
  },
});
