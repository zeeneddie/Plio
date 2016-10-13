import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';
import get from 'lodash.get';
import property from 'lodash.property';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { extractIds, flattenMap, inspire, findById, sortArrayByTitlePrefix } from '/imports/api/helpers.js';

Template.StandardsList.viewmodel({
  share: 'search',
  mixin: ['modal', 'search', 'organization', 'standard', 'collapsing', 'roles', 'router', 'utils', {
    counter: 'counter'
  }],
  hideRTextOnExpand: true,
  onRendered(template) {

    // hack to get around infinite redirect loop
    template.autorun(() => {
      const standardId = this.standardId();
      const orgSerialNumber = this.organizationSerialNumber();
      const list = this.list;
      const shouldUpdate = list && !list.focused() && !list.animating() && !list.searchText();
      const {
        result:contains,
        first:defaultStandard
      } = this._findStandardForFilter(standardId);

      const data = {
        contains,
        defaultStandard,
        standardId,
        orgSerialNumber
      };

      shouldUpdate && this.watcher(data);
    });
  },
  watcher: function({
    contains,
    defaultStandard,
    standardId,
    orgSerialNumber
  }) {
    this.handleRoute();
  },
  handleRoute() {
    const standardId = this.standardId();
    const orgSerialNumber = this.organizationSerialNumber();
    const {
      result:contains,
      first:defaultStandard
    } = this._findStandardForFilter(standardId);

    if (!contains) {
      if (defaultStandard) {
        const { _id } = defaultStandard;

        this.expandCollapsed(_id);
        this.goToStandard(_id);
      } else {
        const params = { orgSerialNumber };
        const queryParams = { filter: FlowRouter.getQueryParam('filter') };
        FlowRouter.go('standards', params, queryParams);
      }
    }
  },
  _findStandardForFilter(_id) {
    const finder = findById(_id);
    const flattenMapStandards = flattenMap(property('standards'));
    const activeStandardFilterId = this.activeStandardFilterId();

    switch(activeStandardFilterId) {
      case 1:
        const sections = this.sections();
        const mappedSections = flattenMapStandards(sections);
        return {
          result: finder(mappedSections),
          first: _.first(mappedSections)
        }
        break;
      case 2:
        const types = this.types();
        const mappedTypes = flattenMap(property('items'), types);
        const mappedTypesSections = flattenMapStandards(mappedTypes);
        return {
          result: finder(mappedTypes) || finder(mappedTypesSections),
          first: (() => {
            // because there may be a situation when only 'Uncategorized' type exists
            const firstMappedType = _.first(mappedTypes);

            if (get(firstMappedType, 'standards')) {
              return _.first(mappedTypesSections);
            }

            return firstMappedType;
          })()
        };
        break;
      case 3:
        const standardsDeleted = this.standardsDeleted();
        return {
          result: finder(standardsDeleted),
          first: _.first(standardsDeleted)
        }
        break;
      default:
        return {};
        break;
    };
  },
  _getSearchQuery() {
    return this.searchObject('searchText', [{ name: 'title' }, { name: 'description' }, { name: 'status' }]);
  },
  totalUnreadMessagesToHtml(totalUnreadMessages) {
    return totalUnreadMessages ? `<i class="fa fa-comments margin-right"></i>
                                  <span>${totalUnreadMessages}</span>`
                               : '';
  },
  _getTotalUnreadMessagesHtml(standards) {
    const standardsIds = extractIds(standards);
    const totalUnreadMessages = standardsIds.reduce((prev, cur) => {
      return prev + this.counter.get('standard-messages-not-viewed-count-' + cur);
    }, 0);
    const totalUnreadMessagesHtml = this.totalUnreadMessagesToHtml(totalUnreadMessages);

    return {
      totalUnreadMessages,
      totalUnreadMessagesHtml
    };
  },
  sections(typeId) {
    const organizationId = this.organizationId();
    const mainQuery = { organizationId, ...this._getSearchQuery() };

    // All sections of the current organization
    const sections = ((() => {
      const query = { organizationId };
      const options = { sort: { title: 1 } };
      const _sections = StandardsBookSections.find(query, options).fetch();

      return sortArrayByTitlePrefix(_sections);
    })());

    /**
     * Filter the sections which fit the search query and have the standards
     * connected
    */
    const filtered = sections.filter(({ _id: sectionId }) => {
      const query = ((() => {
        const _query = { sectionId, ...mainQuery };
        return typeId ? { ..._query, typeId } : _query;
      })());
      return this._getStandardsByQuery(query).count() > 0;
    });

    // Add appropriate standards to the filtered sections
    const withStandards = filtered.map((section) => {
      const standards = this._getStandardsByQuery(mainQuery)
        .fetch()
        .filter((standard) => {
          return Object.is(section._id, standard.sectionId) &&
                 (typeId ? Object.is(typeId, standard.typeId) : true);
        });

      sortArrayByTitlePrefix(standards);

      return Object.assign({}, section, {
        standards,
        ...this._getTotalUnreadMessagesHtml(standards)
      });
    });

    /**
     * Adding "Uncategorized" section: only for standards grouped by sections
    */
    const withUncategorized = ((() => {
      const predicate = standard => !sections.filter(({ _id }) => Object.is(_id, standard.sectionId)).length;
      const query = typeId ? { typeId, ...mainQuery } : mainQuery;
      const standards = this._getStandardsByQuery(query).fetch().filter(predicate);

      if (standards.length) {
        return withStandards.concat({
          organizationId,
          standards,
          _id: `StandardsBookSections.Uncategorized:${typeId || ''}`, // We need a fake id here for searching purposes
          title: 'Uncategorized',
          ...this._getTotalUnreadMessagesHtml(standards)
        });
      }

      return withStandards;
    })());

    return withStandards;
  },

  types() {
    const organizationId = this.organizationId();
    // Standard types for this organization
    const types = ((() => {
      const query = { organizationId };
      const options = { sort: { title: 1 } };
      return StandardTypes.find(query, options).fetch();
    })());

    // Type objects with sections
    const withSections = types.map((type) => {
      const sections = this.sections(type._id);
      const totalUnreadMessages = sections.reduce((prev, cur) => prev + cur.totalUnreadMessages, 0);
      const totalUnreadMessagesHtml = this.totalUnreadMessagesToHtml(totalUnreadMessages);
      const items = sections;

      return Object.assign({}, type, {
        items,
        sections,
        totalUnreadMessages,
        totalUnreadMessagesHtml,
        typeTemplate: 'StandardTypeItem'
      });
    });

    const filtered = withSections.filter(({ sections }) => sections.length);

    /**
     * Adding "Uncategorized" type section: only for standards grouped by types
    */
    // Find standards of non-existent types
    const withUncategorized = ((() => {
      const predicate = standard => !types.filter(({ _id }) => Object.is(_id, standard.typeId)).length;
      const query = { organizationId, ...this._getSearchQuery() };
      const standards = this._getStandardsByQuery(query).fetch().filter(predicate);

      if (standards.length) {
        return filtered.concat({
          organizationId,
          _id: 'StandardTypes.Uncategorized', // We need a fake id here for searching purposes
          items: standards,
          title: 'Uncategorized',
          typeTemplate: 'StandardSectionItem',
          ...this._getTotalUnreadMessagesHtml(standards)
        });
      }

      return filtered;
    })());

    return withUncategorized;
  },
  standardsDeleted() {
    const query = { ...this._getSearchQuery(), isDeleted: true };
    const options = { sort: { deletedAt: -1 } };
    return this._getStandardsByQuery(query, options).fetch();
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
        return Object.assign([], this.standardsDeleted());
      }

      const sections = Object.assign([], this.sections());
      const standards = _.flatten(sections.map(property('standards')));
      const standardsIds = extractIds(standards);

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
