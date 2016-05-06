import { ViewModel } from 'meteor/manuel:viewmodel';

ViewModel.share({
  standard: {
    selectedStandardId: ''
  },
  search: {
    searchText: ''
  },
  organization: {
    orgSerialNumber: ''
  },
});
