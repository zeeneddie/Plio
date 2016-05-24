import { ViewModel } from 'meteor/manuel:viewmodel';

ViewModel.share({
  window: {
    width: null
  },
  standard: {
    selectedStandardId: ''
  },
  search: {
    searchText: ''
  },
  listItems: {
    _rendered: false
  },
  filter: {
    selectedFilter: 'section'
  }
});
