import { ViewModel } from 'meteor/manuel:viewmodel';

ViewModel.share({
  window: {
    width: null
  },
  search: {
    searchText: '',
    precise: false
  },
  uploader: {
    uploads: new ReactiveArray
  }
});
