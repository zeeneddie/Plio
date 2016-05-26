import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';

Template.DashboardPage.viewmodel({
  mixin: ['organization', { 'counter': 'counter' }],
  autorun: [
    function() {
      this._subHandlers([
        this.templateInstance.subscribe('standardsCount', 'standards-count', this.organization()._id),
        this.templateInstance.subscribe('standardsNotViewedCount', 'standards-not-viewed-count', this.organization()._id)
      ]);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ],
  isReady: false,
  _subHandlers: [],
  standardsCount() {
    return this.counter.get('standards-count');
  },
  standardsNotViewedCount() {
    return this.counter.get('standards-not-viewed-count');
  },
  standardsMetrics() {
    const notViewedText = this.standardsNotViewedCount() ? `, ${this.standardsNotViewedCount()} new` : '';
    return this.isReady() ? `${this.standardsCount()} standards${notViewedText}` : 'standards';
  }
});
