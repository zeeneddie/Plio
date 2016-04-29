import { ViewModel } from 'meteor/manuel:viewmodel';

ViewModel.share({
  standard: {
    selectedStandardId: ''
  },
  organization: {
    orgSerialNumber: ''
  },
  search: {
    searchText: ''
  }
});
