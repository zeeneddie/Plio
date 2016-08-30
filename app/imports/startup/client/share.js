import { ViewModel } from 'meteor/manuel:viewmodel';

ViewModel.share({
  window: {
    width: null
  },
  search: {
    searchText: ''
  },
  messages: {
    isInitialDataReady: false,
    options: {
      limit: 50,
      at: null,
      sort: { createdAt: -1 }
    }
  }
});
