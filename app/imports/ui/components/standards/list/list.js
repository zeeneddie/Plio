import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke'
import get from 'lodash.get';
import property from 'lodash.property';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';

Template.StandardsList.viewmodel({
  share: 'search',
  mixin: ['modal', 'search', 'organization', 'standard', 'collapsing', 'roles', 'router', 'utils', {
    counter: 'counter'
  }],
  autorun() {
    if (!this.list.focused() && !this.list.animating() && !this.list.searchText()) {
      const query = this._getQueryForFilter();

      const contains = this._getStandardByQuery({ ...query,  _id: this.standardId() });
      if (!contains) {
        const standard = this._getStandardByQuery({ ...query, ...this._getFirstStandardQueryForFilter() });

        if (standard) {
          const { _id } = standard;
          Meteor.setTimeout(() => {
            this.goToStandard(_id);
            this.expandCollapsed(this.standardId());
          }, 0);
        } else {
          Meteor.setTimeout(() => {
            const params = { orgSerialNumber: this.organizationSerialNumber() };
            const queryParams = { filter: FlowRouter.getQueryParam('filter') };
            FlowRouter.go('standards', params, queryParams);
          }, 0);
        }
      }
    }
  },
  _getQueryForFilter() {
    switch(this.activeStandardFilterId()) {
      case 1:
        return { sectionId: { $in: this.sections().map(({ _id }) => _id) } };
        break;
      case 2:
        return { typeId: { $in: this.types().map(({ _id }) => _id) } };
        break;
      case 3:
        return { _id: this.standardsDeleted().count() > 0 && this.standardsDeleted().fetch()[0]._id };
        break;
      default:
        return {};
        break;
    };
  },
  _getFirstStandardQueryForFilter() {
    switch(this.activeStandardFilterId()) {
      case 1:
        return { sectionId: this.sections().length > 0 && this.sections().map(({ _id }) => _id)[0] };
        break;
      case 2:
        const typeId = this.types().length > 0 && this.types().map(({ _id }) => _id)[0];
        const sectionIds =
                this.sections()
                    .filter(({ _id:sectionId }) => this._getStandardsByQuery({ sectionId, typeId }).count() > 0)
                    .map(({ _id }) => _id);
        const sectionId = sectionIds.length > 0 && sectionIds[0];
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
                                  <span class="hidden-xs-down">${totalUnreadMessages}</span>`
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
