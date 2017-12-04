import { ViewModel } from 'meteor/manuel:viewmodel';

ViewModel.share({
  window: {
    width: null,
  },
  search: {
    searchText: '',
    isPrecise: false,
    searchResult: [],
  },
  uploader: {
    uploads: new ReactiveArray(),
  },
});
