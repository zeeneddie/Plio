import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';
import pluralize from 'pluralize';

Template.DashboardPage.viewmodel({
  mixin: ['organization', { 'counter': 'counter' }],
  autorun: [
    function() {
      const template = this.templateInstance;
      const organizationId = this.organizationId();
      this._subHandlers([
        template.subscribe('standardsCount', 'standards-count', organizationId),
        template.subscribe('standardsNotViewedCount', 'standards-not-viewed-count', organizationId),
        template.subscribe('organizationUsers', this.organization().users.map(({ _id }) => _id)),
        template.subscribe('nonConformitiesCount', 'non-conformities-count', organizationId),
        template.subscribe('nonConformitiesNotViewedCount', 'non-conformities-not-viewed-count', organizationId),
        template.subscribe('risksCount', 'risks-count', organizationId),
        template.subscribe('risksNotViewedCount', 'risks-not-viewed-count', organizationId),
        template.subscribe('actionsCount', 'actions-count', organizationId),
        template.subscribe('actionsNotViewedCount', 'actions-not-viewed-count', organizationId)
      ]);
    },
    function() {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ],
  isReady: false,
  _subHandlers: [],
  _renderMetrics(pluralizeWord = '', totalCount = 0, notViewedCount = 0) {

    // Workaround for https://github.com/blakeembrey/pluralize/pull/12
    const lowerCaseLastSChar = (str) => {
      let lastChar = str.substr(str.length - 1);
      if (str.length > 2 && lastChar === 'S') {
        return str.substr(0, str.length - 1) + lastChar.toLowerCase();
      } else {
        return str;
      }
    }

    const notViewedText = notViewedCount ? `, ${notViewedCount} new` : '';
    return this.isReady() ? lowerCaseLastSChar(pluralize(pluralizeWord, totalCount, true)) + notViewedText : '';
  },
  standardsViewedCount() {
    return this.counter.get('standards-count');
  },
  standardsNotViewedCount() {
    return this.counter.get('standards-not-viewed-count');
  },
  NCsViewedCount() {
    return this.counter.get('non-conformities-count');
  },
  NCsNotViewedCount() {
    return this.counter.get('non-conformities-not-viewed-count');
  },
  actionsViewedCount() {
    return this.counter.get('actions-count');
  },
  actionsNotViewedCount() {
    return this.counter.get('actions-not-viewed-count');
  },
  risksViewedCount() {
    return this.counter.get('risks-count');
  },
  risksNotViewedCount() {
    return this.counter.get('risks-not-viewed-count');
  },
  standardsMetrics() {
    return this._renderMetrics('standard', this.standardsViewedCount(), this.standardsNotViewedCount());
  },
  NCsMetrics() {
    return this._renderMetrics('NC', this.NCsViewedCount(), this.NCsNotViewedCount());
  },
  actionsMetrics() {
    return this._renderMetrics('item', this.actionsViewedCount(), this.actionsNotViewedCount());
  },
  risksMetrics() {
    return this._renderMetrics('risk', this.risksViewedCount(), this.risksNotViewedCount());
  }
});
