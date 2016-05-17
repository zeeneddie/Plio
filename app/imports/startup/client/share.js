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
  organization: {
    orgSerialNumber: ''
  },
  listItems: {
    _rendered: false
  }
});
