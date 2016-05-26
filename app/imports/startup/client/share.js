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
  }
});
