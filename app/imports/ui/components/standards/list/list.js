import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke'
import get from 'lodash.get';
import property from 'lodash.property';

import { StandardsBookSections } from '/imports/share/collections/standards-book-sections.js';
import { StandardTypes } from '/imports/share/collections/standards-types.js';
import { extractIds } from '/imports/api/helpers.js';

Template.StandardsList.viewmodel({
  share: 'search',
  mixin: ['modal', 'search', 'organization', 'standard', 'collapsing', 'roles', 'router', 'utils', {
    counter: 'counter'
  }],
  hideRTextOnExpand: true,
  onRendered(template) {
    // hack to get around infinite redirect loop
    template.autorun(() => {
      const list = this.list;
      const shouldUpdate = list && !list.focused() && !list.animating() && !list.searchText();
      const query = this._getQueryForFilter();
      const contains = this._getStandardByQuery({ ...query,  _id: this.standardId() });
      const defaultStandard = this._getStandardByQuery({ ...query, ...this._getFirstStandardQueryForFilter() });
      const standardId = this.standardId();
      const orgSerialNumber = this.organizationSerialNumber();

      const data = {
        contains,
        defaultStandard,
        standardId,
        orgSerialNumber
      };

      shouldUpdate && this.watcher(data);
    });
  },
  watcher: _.debounce(function({
    contains,
    defaultStandard,
    standardId,
    orgSerialNumber
  }) {
    if (!contains) {
      if (defaultStandard) {
        const { _id } = defaultStandard;
        this.goToStandard(_id);
        this.expandCollapsed(_id);
      } else {
        const params = { orgSerialNumber };
        const queryParams = { filter: FlowRouter.getQueryParam('filter') };
        FlowRouter.go('standards', params, queryParams);
      }
    }
  }, 50),
  _getQueryForFilter() {
    switch(this.activeStandardFilterId()) {
      case 1:
        return { sectionId: { $in: extractIds(this.sections()) } };
        break;
      case 2:
        return { typeId: { $in: extractIds(this.types()) } };
        break;
      case 3:
        return { _id: { $in: extractIds(this.standardsDeleted()) } };
        break;
      default:
        return {};
        break;
    };
  },
  _getFirstStandardQueryForFilter() {
    switch(this.activeStandardFilterId()) {
      case 1:
        return { sectionId: _.first(extractIds(this.sections())) }
        break;
      case 2:
        const typeId = _.first(extractIds(this.types()))
        const sectionId = _.first(extractIds(
          this.sections().filter(({ _id:sectionId }) =>
            this._getStandardsByQuery({ sectionId, typeId }).count())
        ));
        return { typeId, sectionId };
        break;
      default:
        return {};
        break;
    };
  },
  _getSearchQuery() {
    return this.searchObject('searchText', [{ name: 'title' }, { name: 'description' }, { name: 'status' }]);
  },
  renderTotalUnreadMessagesCount(totalUnreadMessages) {
    return totalUnreadMessages ? `<i class="fa fa-comments margin-right"></i>
                                  <span>${totalUnreadMessages}</span>`
                               : '';
  },
  sections(typeId) {
    const sections = ((() => {
      const query = { organizationId: this.organizationId() };
      const options = { sort: { title: 1 } };
      return StandardsBookSections.find(query, options).fetch();
    })());

    const filtered = sections.filter(({ _id:sectionId }) => {
      const query = ((() => {
        const _query = { sectionId, ...this._getSearchQuery() };
        return typeId ? { ..._query, typeId } : _query;
      })());
      return this._getStandardsByQuery(query).count() > 0;
    });

    const withStandards = filtered.map((section) => {
      const standards = this._getStandardsByQuery({ ...this._getSearchQuery() })
        .fetch()
        .filter((standard) => {
          return Object.is(section._id, standard.sectionId) &&
                 (typeId ? Object.is(typeId, standard.typeId) : true);
        });
      const standardsIds = standards.map(property('_id'));
      const totalUnreadMessages = standardsIds.reduce((prev, cur) => {
        return prev + this.counter.get('standard-messages-not-viewed-count-' + cur);
      }, 0);
      const totalUnreadMessagesHtml = this.renderTotalUnreadMessagesCount(totalUnreadMessages);

      return Object.assign({}, section, {
        standards,
        totalUnreadMessages,
        totalUnreadMessagesHtml
      });
    });

    return withStandards;
  },
  types() {
    const types = ((() => {
      const query = { organizationId: this.organizationId() };
      const options = { sort: { name: 1 } };
      return StandardTypes.find(query, options).fetch();
    })());

    const withSections = types.map((type) => {
      const sections = this.sections(type._id);
      const totalUnreadMessages = sections.reduce((prev, cur) => prev + cur.totalUnreadMessages, 0);
      const totalUnreadMessagesHtml = this.renderTotalUnreadMessagesCount(totalUnreadMessages);

      return Object.assign({}, type, {
        sections,
        totalUnreadMessages,
        totalUnreadMessagesHtml
      });
    });

    const filtered = withSections.filter(({ sections }) => {
      return sections.length > 0;
    });

    return filtered;
  },
  standardsDeleted() {
    const query = { ...this._getSearchQuery(), isDeleted: true };
    const options = { sort: { deletedAt: -1 } };
    return this._getStandardsByQuery(query, options);
  },
  sortVms(vms, isTypesFirst = false) {
    const types = vms.filter((vm) => vm.type && vm.type() === 'standardType');

    const sections = vms.filter((vm) => !vm.type || vm.type() !== 'standardType');

    return isTypesFirst ? types.concat(sections) : sections.concat(types);
  },
  _transform() {
    return () => ({
      onValue: vms => this.sortVms(vms, true),
      onEmpty: vms => this.sortVms(vms, false)
    });
  },
  onSearchInputValue() {
    return (value) => {
      if (this.isActiveStandardFilter(3)) {
        return this.toArray(this.standardsDeleted());
      }

      const sections = Object.assign([], this.sections());
      const standards = _.flatten(sections.map(property('standards')));
      const standardsIds = standards.map(property('_id'));

      return standardsIds;
    };
  },
  onModalOpen() {
    return () =>
      this.modal().open({
        _title: 'Compliance standard',
        template: 'CreateStandard',
        variation: 'save'
      });
  }
});
