import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/api/constants.js';


Template.Actions_Edit.viewmodel({
  mixin: ['collapse', 'modal', 'addForm', 'organization'],
  _id: '',
  title: '',
  status: 0,
  ownerId: Meteor.userId(),
  planInPlace: ActionPlanOptions.NO,
  onCreated() {
    const action = this.action && this.action();
    action && this.load(action);
  },
  getData() {
    return { title: this.title() };
  }
});
