import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.OrganizationsMenu.helpers({
  organization() {
    const _id = FlowRouter.getParam("_id");
    return Organizations.findOne(_id);
  },
  organizations() {
    return Organizations.find({ 'users.userId': Meteor.userId() });
  },
  regex() {
    return `^\\/organizations/${this._id}`;
  }
});
