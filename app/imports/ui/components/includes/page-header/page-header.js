import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

/**
 * @param {string} header - The main header text without words after '-'
 * @param {string} idToExpand - id of the document we want to expand after filter switch
 * @param {object} filters - filters to display
 */
Template.PageHeader.viewmodel({
  share: ['search', 'window'],
  mixin: ['organization', 'collapsing'],
  header: '',
  filters: [],
  idToExpand: '',
  isActiveFilter() {},
  headerArgs() {
    const {
      idToExpand,
      filters: filterMap,
    } = this.data();
    const {
      /**
       * @function
       * @param {string} value - id of the current filter
       */
      onSelectFilter,
      /**
       * @function
       * @param {object} e - event
       */
      onNavigate,
      /**
       * Determine which filter is active
       * @function
       * @param {string} value - id of the current filter
       * @returns {boolean} - result
       */
      isActiveFilter = () => {},
      transformHeader = _.identity,
      transformCurrentFilterLabel = _.identity,
    } = this.templateInstance.data;

    const filters = Object.keys(filterMap).map((key) => {
      const filter = filterMap[key];
      const {
        title = '',
        name = '',
        prepend = '',
        append = '',
      } = filter;
      const header = title ? `${title} - ` : '';

      return {
        ...filter,
        header,
        value: key,
        text: `${prepend} ${name} ${append}`.trim(),
      };
    });
    const activeFilter = filters.find(({ value }) => isActiveFilter(value));

    return {
      filters,
      isActiveFilter,
      header: transformHeader(activeFilter.header, activeFilter, filters),
      currentFilterLabel: transformCurrentFilterLabel(activeFilter.text, activeFilter, filters),
      onSelectFilter: (value) => {
        const onSelect = () => {
          FlowRouter.setQueryParams({ filter: value });
          this.searchText('');
          this.expandCollapsed(idToExpand);
        };

        if (_.isFunction(onSelectFilter)) return onSelectFilter(value, onSelect);

        onSelect();

        return this;
      },
      onNavigate: (e) => {
        e.preventDefault();

        if (_.isFunction(onNavigate)) return onNavigate(e);

        if (this.width() && this.width() < 768) {
          this.width(null);
        } else {
          FlowRouter.go('dashboardPage', { orgSerialNumber: this.organizationSerialNumber() });
        }

        return this;
      },
      getOptionsMenu: this.getOptionsMenu,
    };
  },
});
