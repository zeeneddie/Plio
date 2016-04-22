import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standardsBookSections/standardsBookSections.js';
import { Modal } from '../includes/constants.js';

Template.StandardsList.viewmodel({
  stadardsBookSections() {
    return StandardsBookSections.find({}, { sort: { number: 1 } });
  },
  openAddTypeModal(e) {
    Modal.open({
      title: 'Add',
      simple: true,
      template: ''
    });
  }
});
