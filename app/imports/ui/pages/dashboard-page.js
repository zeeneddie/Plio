import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';
import pluralize from 'pluralize';

Template.DashboardPage.viewmodel({
  mixin: ['organization', { 'counter': 'counter' }],
  autorun: [
    function() {
      this._subHandlers([
        this.templateInstance.subscribe('standardsCount', 'standards-count', this.organization()._id),
        this.templateInstance.subscribe('standardsNotViewedCount', 'standards-not-viewed-count', this.organization()._id),
        this.templateInstance.subscribe('organizationOnlineUsers', this.organization().users.map((user) => { return user.userId }))
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
    return this.isReady() ? `${pluralize('standard', this.standardsCount(), true)} ${notViewedText}` : '';
  }
});
