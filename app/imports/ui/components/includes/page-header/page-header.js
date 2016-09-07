import { Template } from 'meteor/templating';

 Template.PageHeader.viewmodel({
   header: '',
   filters: [],
   isActiveFilter() {},
   onSelectFilter() {},
   onNavigate() {},
 });
