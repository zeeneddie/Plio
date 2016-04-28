import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';

Template.StandardsList.viewmodel({
  share: 'organization',
  mixin: 'modal',
  stadardsBookSections() {
    return StandardsBookSections.find({}, { sort: { number: 1 } });
  },
  openAddTypeModal(e) {
    this.modal().open({
      title: 'Add',
      isSimple: true,
      template: 'AddStandardType',
    });
  }
});
