import { ViewModel } from 'meteor/manuel:viewmodel';

ViewModel.share({
  window: {
    width: null
  },
  search: {
    searchText: '',
    isPrecise: false
  },
  uploader: {
    uploads: new ReactiveArray
  }
});
