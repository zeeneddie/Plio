import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';
import pluralize from 'pluralize';

Template.DashboardPage.viewmodel({
  mixin: ['organization', { 'counter': 'counter' }],
  autorun: [
    function() {
      this._subHandlers([
        this.templateInstance.subscribe('standardsCount', 'standards-count', this.organizationId()),
        this.templateInstance.subscribe('standardsNotViewedCount', 'standards-not-viewed-count', this.organizationId()),
        this.templateInstance.subscribe('organizationUsers', this.organization().users.map(user => user.userId)),
        this.templateInstance.subscribe('nonConformitiesCount', 'non-conformities-count', this.organizationId()),
        this.templateInstance.subscribe('nonConformitiesNotViewedCount', 'non-conformities-not-viewed-count', this.organizationId())
      ]);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ],
  isReady: false,
  _subHandlers: [],
  _renderMetrics(pluralizeWord = '', totalCounterName = '', notViewedCounterName = '') {
    const total = this.counter.get(totalCounterName);
    const notViewed = this.counter.get(notViewedCounterName);
    const notViewedText = notViewed ? `, ${notViewed} new` : '';
    return this.isReady() ? pluralize(pluralizeWord, total, true) + notViewedText : '';
  },
  standardsMetrics() {
    return this._renderMetrics('standard', 'standards-count', 'standards-not-viewed-count');
  },
  NCMetrics() {
    return this._renderMetrics('NC', 'non-conformities-count', 'non-conformities-not-viewed-count');
  }
});
