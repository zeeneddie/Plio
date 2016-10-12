import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import get from 'lodash.get';

/**
 * @param {string} header - The main header text without words after '-'
 * @param {string} idToExpand - id of the document we want to expand after filter switch
 * @param {string} prependWith - prepend dropdown items with
 * @param [number] prependIndexes - indexes to which prepend value of 'prependWith'. If not provided prepends to all items.
 * @param {object} filters - filters to display
 */
 Template.PageHeader.viewmodel({
   share: ['search', 'window'],
   mixin: ['organization', 'collapsing'],
   header: '',
   filters: [],
   prependWith: '',
   prependIndexes: [],
   idToExpand: '',
   isActiveFilter() {},
   headerArgs() {
    const {
      idToExpand,
      header,
      filters:filtersData,
      prependWith = '',
      prependIndexes = []
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
      isActiveFilter = () => {}
    } = this.templateInstance.data;

    const filters = Object.keys(filtersData).map((key, i) => ({
      value: key,
      text: `
        ${header} -
        ${(!prependIndexes.length || prependIndexes.includes(i)) ? prependWith : ''}
        ${filtersData[key]}
      `.trim()
    }));
    const activeFilter = filters.find(({ value }) => isActiveFilter(value));
    const currentFilterLabel = activeFilter.text.replace(`${header}`, '');
    return {
       header,
       currentFilterLabel,
       filters,
       isActiveFilter,
       onSelectFilter: (value) => {
         if (_.isFunction(onSelectFilter)) return onSelectFilter(value);

         FlowRouter.setQueryParams({ filter: value });
         this.searchText('');
         this.expandCollapsed(idToExpand);
       },
       onNavigate: (e) => {
         e.preventDefault();

         if (_.isFunction(onNavigate)) return onNavigate(e);

         if (this.width() && this.width() < 768) {
           this.width(null);
         } else {
           FlowRouter.go('dashboardPage', { orgSerialNumber: this.organizationSerialNumber() });
         }
       }
     };
   }
 });
