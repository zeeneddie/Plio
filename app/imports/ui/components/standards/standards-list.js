import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standardsBookSections/standardsBookSections.js';

Template.StandardsList.viewmodel({
  mixin: {
    modal: 'modal'
  },
  stadardsBookSections() {
    return StandardsBookSections.find({}, { sort: { number: 1 } });
  },
  openAddTypeModal(e) {
    this.modal.open({
      title: 'Add',
      simple: true,
      template: 'AddStandardType',
      closeText: 'Cancel'
    });
  }
});
