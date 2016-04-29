import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';

Template.StandardsList.viewmodel({
  share: ['organization', 'search'],
  mixin: ['modal', 'search'],
  stadardsBookSections() {
    const query = this.searchObject('searchText', 'title');
    const options = { sort: { title: 1 } };
    return StandardsBookSections.find(query, options);
  },
  openAddTypeModal(e) {
    this.modal().open({
      title: 'Add',
      isSimple: true,
      template: 'AddStandardType',
    });
  }
});
