import { ViewModel } from 'meteor/manuel:viewmodel';

ViewModel.share({
  window: {
    width: null
  },
  search: {
    searchText: ''
  },
  messages: {
    _scrollProps: null,
    options: {
      limit: 50,
      at: null,
      sort: { createdAt: -1 }
    }
  },
  uploader: {
    uploads: new ReactiveArray
  }
});
