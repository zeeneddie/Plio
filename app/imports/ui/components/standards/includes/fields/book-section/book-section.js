import { Template } from 'meteor/templating';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { insert } from '/imports/api/standards-book-sections/methods.js';


Template.ESBookSection.viewmodel({
  share: 'organization',
  mixin: ['search', 'modal'],
  bookSection: '',
  selectedBookSectionId: '',
  bookSections() {
    const query = this.searchObject('bookSection', 'title');
    const options = { sort: { title: 1 } };
    return StandardsBookSections.find(query, options);
  },
  sectionHintText() {
    return !!this.bookSection() ? `Add "${this.bookSection()}" section` : 'Start typing...';
  },
  selectBookSection({ _id, title }) {
    this.selectedBookSectionId(_id);
    this.bookSection(title);
  },
  addNewSection() {
    const title = this.bookSection();

    if (!title) return;

    if (!confirm(`Are you sure you want to add section: '${title}'?`)) return;

    const org = Organizations.findOne({ serialNumber: this.orgSerialNumber() });
    const organizationId = !!org && org._id;

    this.dropdown.dropdown('toggle');

    this.modal().callMethod(insert, { title, organizationId }, (_id) => {
      this.selectBookSection({ _id, title });
    });
  },
  getData() {
    const { selectedBookSectionId:sectionId } = this.data();
    return { sectionId };
  }
});
