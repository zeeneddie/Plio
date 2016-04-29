import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';


Template.ESBookSection.viewmodel({
  mixin: ['search', 'modal'],
  autorun() {
    const _id = this.selectedBookSectionId();
    if (_id) {
      const bookSection = StandardsBookSections.findOne({ _id });
      const { number, name } = !!bookSection && bookSection;
      this.bookSection(`${number}. ${name}`);
    }
  },
  bookSection: '',
  selectedBookSectionId: '',
  bookSections() {
    const query = this.searchObject('bookSection', 'name');
    const options = { sort: { number: 1 } };
    return StandardsBookSections.find(query, options);
  },
  selectBookSection({ _id }) {
    this.selectedBookSectionId(_id);
  },
  sectionHintText() {
    return !!this.bookSection() ? 'Add new section' : 'Start typing...';
  },
  getData() {
    const { selectedBookSectionId:sectionId } = this.data();
    return { sectionId };
  }
});
