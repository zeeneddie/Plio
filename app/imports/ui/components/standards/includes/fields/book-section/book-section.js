import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { insert } from '/imports/api/standards-book-sections/methods.js';


Template.ESBookSection.viewmodel({
  mixin: ['modal', 'organization', 'collapsing', 'standard'],
  selectedBookSectionId: '',
  section() {
    const _id = this.selectedBookSectionId();
    const section = StandardsBookSections.findOne({ _id });
    return !!section ? section.title : '';
  },
  bookSections() {
    const query = { organizationId: this.organizationId() };
    const options = { sort: { title: 1 } };
    return StandardsBookSections.find(query, options);
  },
  addNewSection(viewmodel, cb) {
    const { section:title } = viewmodel.getData();
    const organizationId = this.organizationId();

    this.modal().callMethod(insert, { title, organizationId }, cb);
  },
  update(e, viewmodel) {
    if (!this._id) return;

    const { sectionId } = viewmodel.getData();

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
    return this.child().getData();
  }
});
