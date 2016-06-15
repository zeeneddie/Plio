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

    // Workaround for https://github.com/blakeembrey/pluralize/pull/12
    const lowerCaseLastSChar = (str) => {
      let lastChar = str.substr(str.length - 1);
      if (str.length > 2 && lastChar === 'S') {
        return str.substr(0, str.length - 1) + lastChar.toLowerCase();
      } else {
        return str;
      }
    }

    const total = this.counter.get(totalCounterName);
    const notViewed = this.counter.get(notViewedCounterName);
    const notViewedText = notViewed ? `, ${notViewed} new` : '';
    return this.isReady() ? lowerCaseLastSChar(pluralize(pluralizeWord, total, true)) + notViewedText : '';
  },
  standardsMetrics() {
    return this._renderMetrics('standard', 'standards-count', 'standards-not-viewed-count');
  },
  NCMetrics() {
    return this._renderMetrics('NC', 'non-conformities-count', 'non-conformities-not-viewed-count');
  }
});
