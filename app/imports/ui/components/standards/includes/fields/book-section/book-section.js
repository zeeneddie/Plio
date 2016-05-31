import { Template } from 'meteor/templating';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { insert } from '/imports/api/standards-book-sections/methods.js';


Template.ESBookSection.viewmodel({
  share: 'standard',
  mixin: ['search', 'modal', 'organization', 'collapsing', 'standard'],
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
    const organizationId = !!this.organization() && this.organization()._id;

    this.modal().callMethod(insert, { title: this.bookSection(), organizationId }, (err, _id) => {
      if (err) {
        swal('Oops... Something went wrong!', err.reason, 'error');
      } else {
        swal("Added!", `Book section "${this.bookSection()}" was added succesfully.`, "success");

        this.selectedBookSectionId(_id);

        this.update();
      }
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
      Tracker.flush();
      this.expandCollapsedStandard(this.standardId());
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
