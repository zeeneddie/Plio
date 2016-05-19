import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';

Template.DashboardPage.viewmodel({
  mixin: ['organization', { 'counter': 'counter' }],
  autorun() {
    this.templateInstance.subscribe('standardsCount', 'organization-standards-count', this.organization()._id);
  },
  standardsCount() {
    return `${this.counter.get('organization-standards-count')} standards`;
  }
});
