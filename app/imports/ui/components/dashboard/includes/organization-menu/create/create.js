import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/share/collections/organizations.js';
import { insert } from '/imports/api/organizations/methods.js';


Template.Organizations_Create.viewmodel({
  mixin: ['modal', 'router'],
  name: '',
  save() {
    const { name, timezone, currency } = this.getData();

    this.modal().callMethod(insert, { name, timezone, currency }, this.onAfterInsert.bind(this));
  },
  onAfterInsert(err, _id) {
    if (!err) {
      this.modal().close();

      const org = Organizations.findOne({ _id });

      !!org && this.goToDashboard(org.serialNumber);
    }
  },
  getData() {
    return this.child('OrgSettings_MainSettings').getData();
  },
});
