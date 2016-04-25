import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';

Template.AddStandardType.viewmodel({
  mixin: {
    modal: 'modal'
  },
  sections() {
    return StandardsBookSections.find({}, { sort: { number: 1 } });
  },
  openEditSectionModal() {
    this.modal.destroy();
    // this.modal.open({
    //   title: 'Standard',
    //   template: 'EditStandard',
    //   closeText: 'Cancel'
    // });
  }
});
