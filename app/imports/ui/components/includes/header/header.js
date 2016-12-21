import { Template } from 'meteor/templating';

Template.Header.viewmodel({
  header: '',
  filters: [],
  isActiveFilter() {},
  onSelectFilter() {},
  onNavigate() {},
  getOptionsMenu() {},
  getOptionsModal() {},
});
