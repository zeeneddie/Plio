import { Template } from 'meteor/templating';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { insert } from '/imports/api/standards-book-sections/methods.js';


Template.ESBookSection.viewmodel({
  mixin: ['search', 'modal', 'organization', 'collapsing'],
  onCreated() {
    const _id = this.selectedBookSectionId();
    if (_id) {
      const section = StandardsBookSections.findOne({ _id });
      section && this.bookSection(section.title);
    }
  },
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
  addNewSection() {
    const title = this.bookSection();

    if (!title) return;

    this.showAlert();
  },
  showAlert() {
    swal(
      {
        title: "Are you sure?",
        text: `New section "${this.bookSection()}" will be added.`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Add",
        closeOnConfirm: false
      },
      () => {
        this.onAlertConfirm();
      }
    );
  },
  onAlertConfirm() {
    swal("Added!", `Book section "${this.bookSection()}" was added succesfully.`, "success");

    const org = Organizations.findOne({ serialNumber: this.organization().serialNumber });
    const organizationId = !!org && org._id;

    this.dropdown.dropdown('toggle');

    this.modal().callMethod(insert, { title: this.bookSection(), organizationId }, (err, _id) => {
      this.selectedBookSectionId(_id);
    });
  },
  update() {
    const { sectionId } = this.getData();

    if (!this._id) return;

    if (!sectionId) {
      this.modal().setError('Book section is required!');
      return;
    }

    this.parent().update({ sectionId }, () => {
      this.expandCollapsedStandard(this.parent().standard()._id);
    });
  },
  getData() {
    const { selectedBookSectionId:sectionId } = this.data();
    return { sectionId };
  },
  events: {
    'focus input'() {
      this.bookSection('');
      this.selectedBookSectionId('');
    }
  }
});
