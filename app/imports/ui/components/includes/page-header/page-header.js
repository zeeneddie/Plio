import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import get from 'lodash.get';

 Template.PageHeader.viewmodel({
   share: ['search', 'window'],
   mixin: ['organization', 'collapsing'],
   header: '',
   filters: [],
   isActiveFilter() {},
   headerArgs() {
    const {
      idToExpand,
      header:text,
      filters:filtersData
    } = this.data();
    const {
      onSelectFilter,
      onNavigate,
      isActiveFilter = () => {}
    } = this.templateInstance.data;

    const filters = Object.keys(filtersData).map(key => ({
      value: key,
      text: `by ${filtersData[key]}`
    }));
    const filter = filters.find(({ value }) => isActiveFilter(value));
    const header = `${text} ${get(filter, 'text').replace('by', '')}`;

     return {
       header,
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
