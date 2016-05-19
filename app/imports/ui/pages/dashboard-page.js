import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';

Template.DashboardPage.viewmodel({
  mixin: ['organization', { 'counter': 'counter' }],
  autorun() {
    this.templateInstance.subscribe('standardsCount', 'standards-count', this.organization()._id);
    this.templateInstance.subscribe('standardsNotViewedCount', 'standards-not-viewed-count', this.organization()._id);
  },
  standardsCount() {
    return this.counter.get('standards-count');
  },
  standardsNotViewedCount() {
    return this.counter.get('standards-not-viewed-count');
  },
  standardsMetrics() {
    return `${this.standardsCount()} standards, ${this.standardsNotViewedCount()} new`;
  }
});
