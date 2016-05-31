import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { insert } from '/imports/api/organizations/methods.js';

Template.OrganizationCreate.viewmodel({
  mixin: 'modal',
  name: '',
  save() {
    const { name } = this.data();
    this.modal().callMethod(insert, { name }, this.onAfterInsert.bind(this));
  },
  onAfterInsert(err, _id) {
    this.modal().close();

    const org = Organizations.findOne({ _id });

    !!org && FlowRouter.setParams({ orgSerialNumber: org.serialNumber });
  }
});
