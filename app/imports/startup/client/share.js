import { ViewModel } from 'meteor/manuel:viewmodel';

ViewModel.share({
  window: {
    width: null
  },
  files: {
    uploaderLink: null
  },
  search: {
    searchText: ''
  }
});
