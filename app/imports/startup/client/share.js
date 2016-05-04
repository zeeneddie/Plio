import { ViewModel } from 'meteor/manuel:viewmodel';

ViewModel.share({
  search: {
    searchText: '',
    searchUser() {
      const searchObject = {};
      if (this.searchText()) {
        const r = new RegExp(`.*${this.searchText()}.*`, "i");
        searchObject['$or'] =
          [
            { 'profile.firstName': r },
            { 'profile.lastName': r },
            { 'profile.description': r },
            { 'emails.0.address': r }
          ]
        ;
      }
      return searchObject;
    }
  }
});