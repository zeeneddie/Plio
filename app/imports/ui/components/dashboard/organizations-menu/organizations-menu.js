import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { Organizations } from '/imports/api/organizations/organizations.js';

Template.OrganizationsMenu.helpers({
  organizations() {
    return Organizations.find({ 'users.userId': Meteor.userId() });
  },
  regex() {
    return `^\\/organizations/${this._id}`;
  }
});

Template.OrganizationsMenu.events({
  'click .js-create-organization'(e, tpl) {
    Blaze.render(Template.NewOrganizationForm, document.body);
  }
});
