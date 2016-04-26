import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';


Template.ESBookSection.viewmodel({
  mixin: 'search',
  bookSection: '',
  selectedBookSection: '',
  bookSections() {
    const query = this.searchObject('bookSection');
    const options = { sort: { number: 1 } };
    return StandardsBookSections.find(query, options);
  },
  selectBookSection(doc) {
    const { _id, number, name } = doc;
    this.bookSection(`${number}. ${name}`);
    this.selectedBookSection(_id);
  },
  getData() {
    const selectedBookSection = { this };
    return { selectedBookSection };
  }
});
